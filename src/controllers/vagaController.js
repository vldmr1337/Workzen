const Job = require("../models/Vaga");
const Application = require('../models/Aplicacoes');
const Usuario = require('../models/Usuario');
const { createNotification } = require('./notificationController');

exports.createJob = async (req, res) => {
  try {
    const { title, description, tags, salario, localizacao, requirements } = req.body;
    const newTags = tags.map(element => element.toLowerCase());
    const job = new Job({
      company: req.user.id,
      title,
      description,
      tags: newTags,
      salario,
      localizacao,
      requirements,
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
    const job = await Job.findById(req.params.jobId).select('-applicants');
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
    const { title, description, requirements, tags, localizacao, salario } = req.body;
    const newTags = tags.map(element => element.toLowerCase());
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { title, description, requirements, tags: newTags, localizacao, salario },
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
      "firstName lastName email image bio titulo tags"
    );
    const applications = await Application.find({ job: req.params.jobId }).populate(
      'user',
      'firstName lastName email image bio titulo'
    );

    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }

    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const applicantsWithStatus = job.applicants.map(applicant => {
      const application = applications.find(app => app.user._id.toString() === applicant._id.toString());
      return {
        ...applicant.toObject(),
        applicationStatus: application ? application.status : 'Rejeitado'
      };
    });
    res.status(200).json({ applicants: applicantsWithStatus });
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

    await Job.updateMany(
      { status: 'Closed' }
    );

    // Envia notificação para o candidato aceito
    const candidate = await Usuario.findById(candidateId);
    const message = `Parabéns! Você foi aceito para a vaga ${job.title}.`;
    await createNotification(candidate._id, message);
    exports.favoriteJobs = async (req, res) => {
      try {
        const { jobId } = req.body;
        const userId = req.user.id;
    
        const user = await Usuario.findByIdAndUpdate(
          userId,
          { $addToSet: { favoritedJobs: jobId } }, 
          { new: true, runValidators: true }
        ).populate('favoritedJobs', 'title description'); 
    
        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
    
        res.status(200).json({
          message: 'Vaga favoritada com sucesso!',
          favoritedJobs: user.favoritedJobs
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao favoritar a vaga', error });
      }
    };
    res.status(200).json({ message: 'Candidato aceito com sucesso', application });
  } catch (error) {
    console.error('Erro ao aceitar candidato:', error);
    res.status(500).json({ message: 'Erro ao aceitar candidato', error });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    
    // Set the limit to 10 items per page
    const limit = 10;
    
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find()
                          .populate('company', 'nome ramo_atividade')
                          .skip(skip)
                          .limit(limit);
    
    const totalJobs = await Job.countDocuments();
    const totalPages = Math.ceil(totalJobs / limit);
    
    res.status(200).json({
      jobs,
      currentPage: page,
      totalPages,
      totalJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar todas as vagas', error });
  }
};
exports.unfavoriteJobs = async (req, res) => {
  try {
    const { id: jobId } = req.params; 
    const userId = req.user.id;

    const user = await Usuario.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const jobIndex = user.favoritedJobs.indexOf(jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Vaga não encontrada nos favoritos do usuário' });
    }

    user.favoritedJobs.splice(jobIndex, 1);
    await user.save();

    res.status(200).json({
      message: 'Vaga removida dos favoritos com sucesso!',
      favoritedJobs: user.favoritedJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover a vaga dos favoritos', error });
  }
};

exports.favoriteJobs = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    const user = await Usuario.findByIdAndUpdate(
      userId,
      { $addToSet: { favoritedJobs: jobId } }, 
      { new: true, runValidators: true }
    ).populate('favoritedJobs', 'title description'); 

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      message: 'Vaga favoritada com sucesso!',
      favoritedJobs: user.favoritedJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao favoritar a vaga', error });
  }
};
exports.getFavorited = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Usuario.findById(userId).populate('favoritedJobs', 'title description');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    if (!user.favoritedJobs || user.favoritedJobs.length === 0) {
      return res.status(200).json({ message: 'Nenhuma vaga favoritada encontrada.', favoritedJobs: [] });
    }
    res.status(200).json({
      message: 'Vagas favoritada recuperadas com sucesso!',
      favoritedJobs: user.favoritedJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao recuperar as vagas favoritada', error });
  }
};
