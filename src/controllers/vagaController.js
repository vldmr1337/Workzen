const Job = require("../models/Vaga");
const Application = require('../models/Aplicacoes');
const Usuario = require('../models/Usuario');
const { createNotification } = require('./notificationController');

exports.createJob = async (req, res) => {
  try {
    const { title, description, tags, salario, localizacao } = req.body;
    const job = new Job({
      company: req.user.id,
      title,
      description,
      tags,
      salario,
      localizacao,
    });

    await job.save();
    res.status(201).json({ job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar vaga", error });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar vagas", error });
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants', 'firstName lastName email');
    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar detalhes da vaga', error });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { title, description, requirements },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    res.status(200).json({ job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar vaga", error });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    res.status(200).json({ message: "Vaga deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar vaga", error });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "applicants",
      "firstName lastName email"
    );
    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    res.status(200).json({ applicants: job.applicants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar candidatos", error });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    const existingApplication = await Application.findOne({ job: jobId, user: userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Usuário já se inscreveu para esta vaga' });
    }

    const application = new Application({
      job: jobId,
      user: userId,
    });

    await application.save();

    // Add applicant to the job's applicants array
    job.applicants.push(userId);
    await job.save();

    res.status(201).json({ message: 'Inscrição bem-sucedida', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao se inscrever na vaga', error });
  }
};
exports.searchJobsByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    const jobs = await Job.find({ tags: tag }).populate('company', 'nome ramo_atividade');
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar vagas por tag', error });
  }
};

exports.acceptCandidate = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params; 

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Vaga não encontrada' });
    }

    // Verifica se o usuário é o dono da vaga
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    // Encontra a candidatura do candidato
    const application = await Application.findOne({ job: jobId, user: candidateId });
    if (!application) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }

    application.status = 'Aceitado'; 
    await application.save();

    await Application.updateMany(
      { job: jobId, _id: { $ne: application._id } }, // Exclui a candidatura aceita
      { status: 'Rejeitado' }
    );

    // Envia notificação para o candidato aceito
    const candidate = await Usuario.findById(candidateId);
    const message = `Parabéns! Você foi aceito para a vaga ${job.title}.`;
    await createNotification(candidate._id, message);

    res.status(200).json({ message: 'Candidato aceito com sucesso', application });
  } catch (error) {
    console.error('Erro ao aceitar candidato:', error);
    res.status(500).json({ message: 'Erro ao aceitar candidato', error });
  }
};
