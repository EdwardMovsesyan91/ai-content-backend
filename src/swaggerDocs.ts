export const swaggerDocumentation = {
  openapi: "3.0.0", // OpenAPI 3.0
  info: {
    title: "AI Content Generator API",
    version: "1.0.0",
    description: "API Documentation for the AI Content Generator project",
  },
  servers: [
    {
      url: "https://ai-content-backend-production.up.railway.app/api",
    },
  ],
  paths: {
    "/auth/signup": {
      post: {
        description: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Invalid input",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        description: "Login for an existing user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/generate": {
      post: {
        description: "Generate a blog post based on input",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  topic: { type: "string" },
                  style: { type: "string" },
                },
                required: ["topic", "style"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successfully generated content",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    content: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
          },
          500: {
            description: "Error generating content",
          },
        },
      },
    },
    "/posts/save": {
      post: {
        description: "Save a post to the database",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  isPublic: { type: "boolean" },
                  isDraft: { type: "boolean" },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Post saved successfully",
          },
          400: {
            description: "Invalid input",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/posts/user": {
      get: {
        description: "Get all posts for the authenticated user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "List of user's posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      content: { type: "string" },
                      isPublic: { type: "boolean" },
                      isDraft: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/posts/public": {
      get: {
        description: "Get all public, non-draft posts",
        responses: {
          200: {
            description: "List of public posts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          content: { type: "string" },
                          isPublic: { type: "boolean" },
                          isDraft: { type: "boolean" },
                          createdAt: { type: "string", format: "date-time" },
                          _id: { type: "string" },
                          userId: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
          },
        },
      },
    },
    "/posts/{id}": {
      get: {
        description: "Get a public post by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Post found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    isPublic: { type: "boolean" },
                    isDraft: { type: "boolean" },
                  },
                },
              },
            },
          },
          404: {
            description: "Post not found",
          },
        },
      },
      put: {
        description: "Update a post by ID",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  isPublic: { type: "boolean" },
                  isDraft: { type: "boolean" },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Post updated successfully",
          },
          400: {
            description: "Invalid input",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
      delete: {
        description: "Delete a post by ID",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Post deleted successfully",
          },
          404: {
            description: "Post not found",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
  },
};
