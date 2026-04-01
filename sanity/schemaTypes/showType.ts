import { defineField, defineType } from "sanity";

export const showType = defineType({
  name: "show",
  title: "Show",
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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Announced", value: "announced" },
          { title: "Sold Out", value: "sold-out" },
          { title: "Canceled", value: "canceled" }
        ]
      },
      initialValue: "announced",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "startsAt",
      title: "Start Date & Time",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url"
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "flyer",
      title: "Flyer",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({
      name: "lineup",
      title: "Lineup Notes",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "notes",
      title: "Extra Notes",
      type: "text",
      rows: 4
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "venue"
    }
  }
});
