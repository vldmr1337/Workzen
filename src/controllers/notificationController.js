const Notificacao = require('../models/Notificacoes');

exports.createNotification = async (userId, message) => {
  try {
    const notification = new Notificacao({
      user: userId,
      message,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    throw new Error('Erro ao criar notificação');
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notificacao.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações', error });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notificacao.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ message: 'Erro ao marcar notificação como lida', error });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notificacao.findById(req.params.notificationId);

  const notificationidd = req.params.notificationId;

    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await Notificacao.findByIdAndDelete(notificationidd);

    res.status(200).json({ message: 'Notificação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir notificação:', error);
    res.status(500).json({ message: 'Erro ao excluir notificação', error });
  }
};
