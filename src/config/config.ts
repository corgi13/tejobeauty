// config/config.ts - Centralizirana konfiguracija aplikacije
import dotenv from "dotenv";
// config/config.ts - Centralizirana konfiguracija aplikacije
import dotenv from "dotenv";

// Učitaj .env datoteku
dotenv.config();

// Definicija konfiguracije
interface Config {
  env: string;
  port: number;
  mongodb: {
    uri: string;
    options: {
      useNewUrlParser: boolean;
      useUnifiedTopology: boolean;
    };
  };
  algolia: {
    appId: string;
    apiKey: string;
    indexName: string;
  };
  ml: {
    endpoint: string;
    apiKey: string;
  };
  logging: {
    level: "error" | "warn" | "info" | "debug";
    enableConsole: boolean;
    enableFile: boolean;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

// Standardna konfiguracija
const config: Config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/tejo-nails",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || "",
    apiKey: process.env.ALGOLIA_API_KEY || "",
    indexName: process.env.ALGOLIA_INDEX_NAME || "products",
  },
  ml: {
    endpoint: process.env.ML_ENDPOINT || "https://your-ml-service.com/api",
    apiKey: process.env.ML_API_KEY || "",
  },
  logging: {
    level:
      (process.env.LOG_LEVEL as "error" | "warn" | "info" | "debug") || "info",
    enableConsole: true,
    enableFile: process.env.NODE_ENV === "production",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};

export default config;
// Učitaj .env datoteku
dotenv.config();

// Definicija konfiguracije
interface Config {
  env: string;
  port: number;
  mongodb: {
    uri: string;
    options: {
      useNewUrlParser: boolean;
      useUnifiedTopology: boolean;
    };
  };
  algolia: {
    appId: string;
    apiKey: string;
    indexName: string;
  };
  ml: {
    endpoint: string;
    apiKey: string;
  };
  logging: {
    level: "error" | "warn" | "info" | "debug";
    enableConsole: boolean;
    enableFile: boolean;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

// Standardna konfiguracija
const config: Config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/tejo-nails",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || "",
    apiKey: process.env.ALGOLIA_API_KEY || "",
    indexName: process.env.ALGOLIA_INDEX_NAME || "products",
  },
  ml: {
    endpoint: process.env.ML_ENDPOINT || "https://your-ml-service.com/api",
    apiKey: process.env.ML_API_KEY || "",
  },
  logging: {
    level:
      (process.env.LOG_LEVEL as "error" | "warn" | "info" | "debug") || "info",
    enableConsole: true,
    enableFile: process.env.NODE_ENV === "production",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};

export default config;
