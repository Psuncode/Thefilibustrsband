export type FaqEntry = {
  question: string;
  answer: string;
};

export type FaqPage = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
};

export const buildFaqSchema = (items: ReadonlyArray<FaqEntry>): FaqPage => {
  if (items.length === 0) {
    throw new Error("buildFaqSchema requires at least one FAQ entry");
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
};
