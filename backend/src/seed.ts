import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user (password will be hashed by the auth service)
  const admin = await prisma.user.upsert({
    where: { email: "admin@tejonails.com" },
    update: {},
    create: {
      email: "admin@tejonails.com",
      password: "admin123", // This will be hashed by the auth service
      firstName: "Admin",
      lastName: "User",
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log("Admin user created:", admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "nail-polish" },
      update: {},
      create: {
        name: "Nail Polish",
        slug: "nail-polish",
        description: "High-quality nail polishes in various colors",
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "nail-care" },
      update: {},
      create: {
        name: "Nail Care",
        slug: "nail-care",
        description: "Products for nail care and maintenance",
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "tools" },
      update: {},
      create: {
        name: "Tools",
        slug: "tools",
        description: "Professional nail tools and equipment",
        isActive: true,
      },
    }),
  ]);

  console.log("Categories created:", categories.length);

  // Create products with European pricing (EUR)
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "classic-red-nail-polish" },
      update: {},
      create: {
        name: "Classic Red Nail Polish",
        slug: "classic-red-nail-polish",
        sku: "NP-RED-001",
        description: "Long-lasting classic red nail polish perfect for Croatian summers",
        price: 11.99,
        compareAtPrice: 14.99,
        inventory: 100,
        isActive: true,
        categoryId: categories[0].id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1613897524149-6b86aa98a9cf",
              altText: "Classic Red Nail Polish",
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "mediterranean-blue-polish" },
      update: {},
      create: {
        name: "Mediterranean Blue Polish",
        slug: "mediterranean-blue-polish",
        sku: "NP-BLUE-001",
        description: "Inspired by the beautiful Croatian Adriatic Sea",
        price: 13.99,
        compareAtPrice: 16.99,
        inventory: 75,
        isActive: true,
        categoryId: categories[0].id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
              altText: "Mediterranean Blue Polish",
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "lavender-fields-polish" },
      update: {},
      create: {
        name: "Lavender Fields Polish",
        slug: "lavender-fields-polish",
        sku: "NP-LAV-001",
        description: "Soft lavender inspired by Istrian lavender fields",
        price: 12.99,
        inventory: 90,
        isActive: true,
        categoryId: categories[0].id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
              altText: "Lavender Fields Polish",
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "professional-nail-file" },
      update: {},
      create: {
        name: "Professional Nail File",
        slug: "professional-nail-file",
        sku: "TOOL-FILE-001",
        description: "High-quality professional nail file - EU certified",
        price: 7.99,
        inventory: 200,
        isActive: true,
        categoryId: categories[2].id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53",
              altText: "Professional Nail File",
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "cuticle-care-oil" },
      update: {},
      create: {
        name: "Cuticle Care Oil",
        slug: "cuticle-care-oil",
        sku: "CARE-OIL-001",
        description: "Nourishing cuticle oil with Mediterranean herbs",
        price: 9.99,
        compareAtPrice: 12.99,
        inventory: 150,
        isActive: true,
        categoryId: categories[1].id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a",
              altText: "Cuticle Care Oil",
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: "gel-base-coat" },
      update: {},
      create: {
        name: "Professional Gel Base Coat",
        slug: "gel-base-coat",
        sku: "GEL-BASE-001",
        description: "Long-lasting gel base coat for professional results",
        price: 15.99,
        inventory: 80,
        isActive: true,
        categoryId: categories[1].id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66",
              altText: "Professional Gel Base Coat",
              sortOrder: 1,
            },
          ],
        },
      },
    }),
  ]);

  console.log("Products created:", products.length);
  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
