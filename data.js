// عدّلي هذا الملف لإضافة أعمالك. المسارات نسبية ليعمل الموقع على GitHub Pages أيضًا.
export const portfolio = {
  name: "رغد",
  email: "", // أضيفي بريدك لتفعيل زر التواصل بالبريد.
  images: [
    {
      id: "identity",
      title: "هوية تترك أثرًا",
      category: "تصميم وهوية بصرية",
      description:
        "مساحة تجريبية لعرض مشروع هوية بصرية وتفاصيل تطبيقاتها. استبدلي الصور بأعمالك الحقيقية.",
      images: [
        "assets/images/identity.svg",
        "assets/images/identity-detail.svg",
      ],
      placeholder: true,
    },
    {
      id: "campaign",
      title: "فكرة تستحق أن تُرى",
      category: "حملات إعلانية",
      description: "مساحة تجريبية لتصاميم الحملات والمحتوى الإعلاني.",
      images: ["assets/images/campaign.svg"],
      placeholder: true,
    },
    {
      id: "content",
      title: "محتوى يحكي قصة",
      category: "صناعة المحتوى",
      description:
        "مساحة تجريبية لعرض منشورات التواصل الاجتماعي وسلسلة المحتوى.",
      images: ["assets/images/content.svg"],
      placeholder: true,
    },
    {
      id: "direction",
      title: "من الفكرة إلى المشهد",
      category: "إخراج فني · Storyboard",
      description: "مساحة تجريبية للوحة الأفكار والتصور البصري للمشروع.",
      images: ["assets/images/direction.svg"],
      placeholder: true,
    },
  ],
  videos: [
    {
      id: "brand-film",
      title: "قصة علامة في ثوانٍ",
      category: "فيديو إعلاني",
      description:
        "مكان تجريبي لفيديو إعلاني. أضيفي ملف MP4 أو رابط YouTube أو Vimeo من ملف البيانات.",
      poster: "assets/images/video-brand.svg",
      src: "",
      placeholder: true,
    },
    {
      id: "reel",
      title: "تفاصيل تصنع الفرق",
      category: "مونتاج وصناعة محتوى",
      description: "مكان تجريبي لمقطع قصير يعرض مهارات المونتاج والسرد البصري.",
      poster: "assets/images/video-reel.svg",
      src: "",
      placeholder: true,
    },
  ],
};
export const tools = [
  {
    name: "ChatGPT",
    label: "أفكار وكتابة أوامر",
    domain: "chatgpt.com",
    url: "https://chatgpt.com/",
  },
  {
    name: "Google Flow",
    label: "تصوّر وإنتاج المشاهد",
    domain: "labs.google",
    url: "https://labs.google/flow/about",
  },
  {
    name: "Google AI Studio",
    label: "تجارب الذكاء الاصطناعي",
    domain: "aistudio.google.com",
    url: "https://aistudio.google.com/",
  },
  {
    name: "Google NotebookLM",
    label: "بحث وتنظيم المعرفة",
    domain: "notebooklm.google.com",
    url: "https://notebooklm.google.com/",
  },
  {
    name: "CapCut",
    label: "مونتاج وصناعة الفيديو",
    domain: "www.capcut.com",
    url: "https://www.capcut.com/",
  },
  {
    name: "Microsoft Excel",
    label: "تخطيط وتحليل البيانات",
    domain: "excel.cloud.microsoft",
    url: "https://excel.cloud.microsoft/",
  },
  {
    name: "Microsoft Word",
    label: "كتابة وتنسيق المحتوى",
    domain: "word.cloud.microsoft",
    url: "https://word.cloud.microsoft/",
  },
  {
    name: "Microsoft PowerPoint",
    label: "عروض تسرد الأفكار",
    domain: "powerpoint.cloud.microsoft",
    url: "https://powerpoint.cloud.microsoft/",
  },
];
