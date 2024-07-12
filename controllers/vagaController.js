const Job = require("../models/Vaga");

exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;
    const job = new Job({
      company: req.user.id,
      title,
      description,
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
    const job = await Job.findById(req.params.jobId).populate(
      "company",
      "name"
    );
    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }
    res.status(200).json({ job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao obter detalhes da vaga", error });
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
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Vaga não encontrada" });
    }
    if (!job.applicants.includes(req.user.id)) {
      job.applicants.push(req.user.id);
      await job.save();
    }
    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: "Usuário já inscrito" });
    }
    res.status(200).json({ message: "Inscrição realizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao se inscrever na vaga", error });
  }
};
