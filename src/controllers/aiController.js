const Job = require("../models/Vaga");
const Usuario = require('../models/Usuario');
const model = require('../config/gemini');  // Importa o modelo configurado

async function generateContent(job, users) {
    console.log(job);
    console.log(users);
    const prompt = `
    Aqui estão dados de usuários e uma vaga de emprego. Ordene os usuários pela porcentagem de compatibilidade com a vaga. 
    A compatibilidade é baseada no perfil do user em relação com o perfil da vaga.
    
    Usuários:
    ${users.map(user => `Nome: ${user.firstName} ${user.lastName}, Tags: ${user.tags.join(", ")}, Localização: ${user.localizacao} Titulo: ${user.titulo}, Bio: ${user.bio}`).join("\n")}

    Vaga:
    Título: ${job.title}
    Tags: ${job.tags.join(", ")}
    Localização: ${job.localizacao}

    Ordene os usuários pela porcentagem de compatibilidade com a vaga.
    retorne apenas um objeto json chamado users, com os campos name e compatibility. sem nada, absolutamente nada adicional, caso n tenha nehuma informação relevante no array que eu te mandar, simplesmente retorne um json com um array vazio
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedText = responseText.replace(/^```json\s*|\s*```$/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}

exports.getApplicantsWithAI = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).select("-applicants");
        const jobWithApplicants = await Job.findById(req.params.jobId).populate(
            "applicants",
            "firstName lastName email image bio titulo tags localizacao"
        );

        if (!job) {
            return res.status(404).json({ message: "Vaga não encontrada" });
        }

       

        // Obtém os usuários da lista de candidatos
        const users = jobWithApplicants.applicants;

        // Gera a classificação de compatibilidade usando o modelo AI
        const aiResults = await generateContent(job, users);

        // Envia a resposta com os usuários ordenados
        res.status(200).json({ applicants: aiResults.users });
    } catch (error) {
        console.error('Erro ao listar candidatos com AI:', error);
        res.status(500).json({ message: "Erro ao listar candidatos com AI", error });
    }
};
