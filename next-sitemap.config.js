/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://btl-tv.com",
  generateRobotsTxt: true,
  exclude: [
    "/admin",
    "/admin/*",
    "/dashboard",
    "/profile",
    "/auth/login",
    "/auth/signup",
    "/forgot-password",
    "/reset-password",
    "/api/*",
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/dashboard", "/profile", "/auth", "/api"] },
    ],
  },
  transform: async (config, path) => {
    var priority = 0.5;
    var changefreq = "monthly";
    if (path === "/") { priority = 1.0; changefreq = "daily"; }
    else if (path === "/bible-school") { priority = 0.9; changefreq = "weekly"; }
    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
    };
  },
};
