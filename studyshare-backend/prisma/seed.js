"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Seeding database...');
        // Create universities
        const university1 = yield prisma.university.upsert({
            where: { name: 'Tehran University' },
            update: {},
            create: {
                name: 'Tehran University',
                description: 'One of the oldest and most prestigious universities in Iran',
                type: 'Technical',
            },
        });
        const university2 = yield prisma.university.upsert({
            where: { name: 'Sharif University of Technology' },
            update: {},
            create: {
                name: 'Sharif University of Technology',
                description: 'Premier engineering and technology university in Iran',
                type: 'Technical',
            },
        });
        const university3 = yield prisma.university.upsert({
            where: { name: 'Tehran University of Medical Sciences' },
            update: {},
            create: {
                name: 'Tehran University of Medical Sciences',
                description: 'Leading medical university in Iran',
                type: 'Medical',
            },
        });
        // Create faculties for Tehran University
        const faculty1 = yield prisma.faculty.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                name: 'Engineering',
                universityId: university1.id,
            },
        });
        const faculty2 = yield prisma.faculty.upsert({
            where: { id: 2 },
            update: {},
            create: {
                id: 2,
                name: 'Computer Science',
                universityId: university1.id,
            },
        });
        // Create faculties for Sharif University
        const faculty3 = yield prisma.faculty.upsert({
            where: { id: 3 },
            update: {},
            create: {
                id: 3,
                name: 'Electrical Engineering',
                universityId: university2.id,
            },
        });
        const faculty4 = yield prisma.faculty.upsert({
            where: { id: 4 },
            update: {},
            create: {
                id: 4,
                name: 'Computer Engineering',
                universityId: university2.id,
            },
        });
        // Create faculties for Medical University
        const faculty5 = yield prisma.faculty.upsert({
            where: { id: 5 },
            update: {},
            create: {
                id: 5,
                name: 'Medicine',
                universityId: university3.id,
            },
        });
        // Create subjects
        yield prisma.subject.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                name: 'Data Structures',
                facultyId: faculty2.id,
            },
        });
        yield prisma.subject.upsert({
            where: { id: 2 },
            update: {},
            create: {
                id: 2,
                name: 'Algorithms',
                facultyId: faculty2.id,
            },
        });
        yield prisma.subject.upsert({
            where: { id: 3 },
            update: {},
            create: {
                id: 3,
                name: 'Database Systems',
                facultyId: faculty2.id,
            },
        });
        yield prisma.subject.upsert({
            where: { id: 4 },
            update: {},
            create: {
                id: 4,
                name: 'Circuit Theory',
                facultyId: faculty3.id,
            },
        });
        yield prisma.subject.upsert({
            where: { id: 5 },
            update: {},
            create: {
                id: 5,
                name: 'Digital Logic Design',
                facultyId: faculty3.id,
            },
        });
        yield prisma.subject.upsert({
            where: { id: 6 },
            update: {},
            create: {
                id: 6,
                name: 'Anatomy',
                facultyId: faculty5.id,
            },
        });
        yield prisma.subject.upsert({
            where: { id: 7 },
            update: {},
            create: {
                id: 7,
                name: 'Physiology',
                facultyId: faculty5.id,
            },
        });
        console.log('✅ Database seeded successfully!');
    });
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
