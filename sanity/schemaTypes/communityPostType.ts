import { defineField, defineType } from "sanity";
import { communityCategories } from "../../src/data/community";

export const communityPostType = defineType({
  name: "communityPost",
  title: "Community Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: communityCategories.map((cat) => ({ title: cat, value: cat }))
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "heroAlt",
      title: "Hero Image Alt Text",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "relatedShow",
      title: "Related Show",
      type: "reference",
      to: [{ type: "show" }]
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "heroImage"
    }
  }
});
