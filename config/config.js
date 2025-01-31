module.exports = {
    development: {
      username: "api_admin",
      password: "admin",
      database: "boutique_info",
      host: "localhost",  // ou l'IP de ton serveur SQL
      dialect: "mssql",
      dialectOptions: {
        options: {
          encrypt: false, // Mets true si tu utilises Azure
          trustServerCertificate: true, // À activer si tu es en local
        },
      },
    },
    production: {
        username: "sa",
        password: "TonMotDePasse",
        database: "NomDeTaBaseProd",
        host: "adresse_ip_serveur_prod",
        dialect: "mssql",
        dialectOptions: {
          options: {
            encrypt: true, // À activer si tu utilises Azure
            trustServerCertificate: false, // Pour la production
          },
        },
      },
    };