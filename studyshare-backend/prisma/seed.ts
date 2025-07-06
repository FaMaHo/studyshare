import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create universities
  const university1 = await prisma.university.upsert({
    where: { name: 'Tehran University' },
    update: {},
    create: {
      name: 'Tehran University',
      description: 'One of the oldest and most prestigious universities in Iran',
      type: 'Technical',
    },
  });

  const university2 = await prisma.university.upsert({
    where: { name: 'Sharif University of Technology' },
    update: {},
    create: {
      name: 'Sharif University of Technology',
      description: 'Premier engineering and technology university in Iran',
      type: 'Technical',
    },
  });

  const university3 = await prisma.university.upsert({
    where: { name: 'Tehran University of Medical Sciences' },
    update: {},
    create: {
      name: 'Tehran University of Medical Sciences',
      description: 'Leading medical university in Iran',
      type: 'Medical',
    },
  });

  // Create faculties for Tehran University
  const faculty1 = await prisma.faculty.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Engineering',
      universityId: university1.id,
    },
  });

  const faculty2 = await prisma.faculty.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Computer Science',
      universityId: university1.id,
    },
  });

  // Create faculties for Sharif University
  const faculty3 = await prisma.faculty.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Electrical Engineering',
      universityId: university2.id,
    },
  });

  const faculty4 = await prisma.faculty.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Computer Engineering',
      universityId: university2.id,
    },
  });

  // Create faculties for Medical University
  const faculty5 = await prisma.faculty.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      name: 'Medicine',
      universityId: university3.id,
    },
  });

  // Create subjects
  await prisma.subject.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Data Structures',
      facultyId: faculty2.id,
    },
  });

  await prisma.subject.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Algorithms',
      facultyId: faculty2.id,
    },
  });

  await prisma.subject.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Database Systems',
      facultyId: faculty2.id,
    },
  });

  await prisma.subject.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Circuit Theory',
      facultyId: faculty3.id,
    },
  });

  await prisma.subject.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      name: 'Digital Logic Design',
      facultyId: faculty3.id,
    },
  });

  await prisma.subject.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      name: 'Anatomy',
      facultyId: faculty5.id,
    },
  });

  await prisma.subject.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      name: 'Physiology',
      facultyId: faculty5.id,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 