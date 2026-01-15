/**
 * 聯絡頁硬編碼內容
 * Template 自主決定所有顯示內容
 */

export const CONTACT_CONTENT = {
  intro: {
    title: '聯絡鎰威',
    description: `歡迎聯繫鎰威科技，我們將竭誠為您服務。

請填寫以下表單，我們將盡快與您聯繫。`,
  },

  form: {
    label: 'Contact',
    title: '聯絡資訊',
    fields: [
      {
        name: 'name',
        label: '您的大名',
        placeholder: '請輸入您的姓名',
        required: true,
        type: 'text' as const,
      },
      {
        name: 'email',
        label: '電子郵件',
        placeholder: '請輸入您的電子郵件',
        required: true,
        type: 'email' as const,
      },
      {
        name: 'phone',
        label: '電話 / 手機號碼',
        placeholder: '請輸入您的電話 / 手機號碼',
        required: false,
        type: 'tel' as const,
      },
      {
        name: 'company',
        label: '公司名稱',
        placeholder: '請輸入您的公司名稱',
        required: false,
        type: 'text' as const,
      },
      {
        name: 'message',
        label: '詢問內容',
        placeholder: '請輸入您要詢問的內容',
        required: true,
        type: 'textarea' as const,
      },
    ],
    button_text: '送出',
  },

  // 圖片 ID
  images: {
    hero: 'contact_banner',
    hero_mobile: 'contact_banner_mobile',
  },
};
