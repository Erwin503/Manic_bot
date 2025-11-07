export const keyboards = {
  sharePhone: () => ({
    reply_markup: {
      keyboard: [[{ text: "Поделиться телефоном", request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  }),
};
