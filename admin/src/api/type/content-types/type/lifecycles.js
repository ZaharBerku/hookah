module.exports = {
  async beforeCreate(event) {
    if (!event.params.data.slugType && event.params.data.locale === "ru") {
      // @ts-ignore
      const latestCreatedType = await strapi.query("api::type.type").findOne({
        orderBy: { createdAt: "desc" },
        where: { locale: "uk" },
      });
      const slug = latestCreatedType.slug;
      event.params.data.slugType = slug;
    } else if (
      event.params.data.locale === "uk" &&
      !event.params.data.slugType
    ) {
      event.params.data.slugType = event.params.data.slug;
    }
  }
};
