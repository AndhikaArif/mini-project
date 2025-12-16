import { faker } from "@faker-js/faker";

import "dotenv/config";
import {
  PrismaClient,
  RoleType,
  CategoryOption,
  LocationOption,
} from "../src/generated/index.js";

const prisma = new PrismaClient();

async function seed() {
  try {
    console.info("🌱 Seeding database...");

    /* -------------------------------------------------------------------------- */
    /*                               Clean Previous                               */
    /* -------------------------------------------------------------------------- */
    console.info("🚮 Deleting previous data...");
    await prisma.user.deleteMany();
    await prisma.event.deleteMany();
    await prisma.voucher.deleteMany();
    await prisma.eventImage.deleteMany();
    console.info("👌 All previous data deleted");

    /* -------------------------------------------------------------------------- */
    /*                                Create Users                                */
    /* -------------------------------------------------------------------------- */
    console.info("👥 Creating 30 users (10 organizers, 20 customers)...");

    const eventOrganizers = [
      {
        name: "Andi Pratama",
        username: "andipratama",
        email: "andi.pratama@example.com",
        password: "andi12345",
        referralCode: "EO-ANDI-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Budi Santoso",
        username: "budisantoso",
        email: "budi.santoso@example.com",
        password: "budi12345",
        referralCode: "EO-BUDI-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Citra Lestari",
        username: "citralestari",
        email: "citra.lestari@example.com",
        password: "citra12345",
        referralCode: "EO-CITRA-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Dimas Arya",
        username: "dimasarya",
        email: "dimas.arya@example.com",
        password: "dimas12345",
        referralCode: "EO-DIMAS-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Eka Putri",
        username: "ekaputri",
        email: "eka.putri@example.com",
        password: "eka12345",
        referralCode: "EO-EKA-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Fajar Nugroho",
        username: "fajarnugroho",
        email: "fajar.nugroho@example.com",
        password: "fajar12345",
        referralCode: "EO-FAJAR-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Gita Maharani",
        username: "gitamaharani",
        email: "gita.maharani@example.com",
        password: "gita12345",
        referralCode: "EO-GITA-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Hendra Wijaya",
        username: "hendrawijaya",
        email: "hendra.wijaya@example.com",
        password: "hendra12345",
        referralCode: "EO-HENDRA-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Intan Permata",
        username: "intanpermata",
        email: "intan.permata@example.com",
        password: "intan12345",
        referralCode: "EO-INTAN-01",
        role: RoleType.EVENT_ORGANIZER,
      },
      {
        name: "Joko Saputra",
        username: "jokosaputra",
        email: "joko.saputra@example.com",
        password: "joko12345",
        referralCode: "EO-JOKO-01",
        role: RoleType.EVENT_ORGANIZER,
      },
    ];

    const customers = [
      {
        name: "Ahmad Fauzi",
        username: "ahmadfauzi",
        email: "ahmad.fauzi@example.com",
        password: "ahmad12345",
        referralCode: "REF-AHMAD01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Bella Rahma",
        username: "bellarahma",
        email: "bella.rahma@example.com",
        password: "bella12345",
        referralCode: "REF-BELLA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Chandra Wijaya",
        username: "chandrawijaya",
        email: "chandra.wijaya@example.com",
        password: "chandra12345",
        referralCode: "REF-CHANDRA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Dewi Anggraini",
        username: "dewianggraini",
        email: "dewi.anggraini@example.com",
        password: "dewi12345",
        referralCode: "REF-DEWI01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Eko Saputra",
        username: "ekosaputra",
        email: "eko.saputra@example.com",
        password: "eko12345",
        referralCode: "REF-EKO01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Fitri Lestari",
        username: "fitrilestari",
        email: "fitri.lestari@example.com",
        password: "fitri12345",
        referralCode: "REF-FITRI01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Gilang Prakoso",
        username: "gilangprakoso",
        email: "gilang.prakoso@example.com",
        password: "gilang12345",
        referralCode: "REF-GILANG01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Hana Putri",
        username: "hanaputri",
        email: "hana.putri@example.com",
        password: "hana12345",
        referralCode: "REF-HANA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Indra Kurniawan",
        username: "indrakurniawan",
        email: "indra.kurniawan@example.com",
        password: "indra12345",
        referralCode: "REF-INDRA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Jihan Amelia",
        username: "jihanamelia",
        email: "jihan.amelia@example.com",
        password: "jihan12345",
        referralCode: "REF-JIHAN01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Kevin Hartono",
        username: "kevinhartono",
        email: "kevin.hartono@example.com",
        password: "kevin12345",
        referralCode: "REF-KEVIN01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Lia Puspita",
        username: "liapuspita",
        email: "lia.puspita@example.com",
        password: "lia12345",
        referralCode: "REF-LIA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Miko Pratama",
        username: "mikopratama",
        email: "miko.pratama@example.com",
        password: "miko12345",
        referralCode: "REF-MIKO01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Nadia Safitri",
        username: "nadiasafitri",
        email: "nadia.safitri@example.com",
        password: "nadia12345",
        referralCode: "REF-NADIA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Oscar Mahendra",
        username: "oscarmahendra",
        email: "oscar.mahendra@example.com",
        password: "oscar12345",
        referralCode: "REF-OSCAR01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Putri Ayu",
        username: "putriayu",
        email: "putri.ayu@example.com",
        password: "putri12345",
        referralCode: "REF-PUTRI01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Raka Firmansyah",
        username: "rakafirmansyah",
        email: "raka.firmansyah@example.com",
        password: "raka12345",
        referralCode: "REF-RAKA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Salsa Maharani",
        username: "salsamaharani",
        email: "salsa.maharani@example.com",
        password: "salsa12345",
        referralCode: "REF-SALSA01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Tio Ramadhan",
        username: "tioramadhan",
        email: "tio.ramadhan@example.com",
        password: "tio12345",
        referralCode: "REF-TIO01",
        role: RoleType.CUSTOMER,
      },
      {
        name: "Vina Oktaviani",
        username: "vinaoktaviani",
        email: "vina.oktaviani@example.com",
        password: "vina12345",
        referralCode: "REF-VINA01",
        role: RoleType.CUSTOMER,
      },
    ];

    const createdEventOrganizers = await Promise.all(
      eventOrganizers.map((u) => prisma.user.create({ data: u }))
    );

    const createdCustomers = await Promise.all(
      customers.map((u) => prisma.user.create({ data: u }))
    );

    const allUsers = [...createdEventOrganizers, ...createdCustomers];
    console.info(`✅ Created ${allUsers.length} users`);

    /* -------------------------------------------------------------------------- */
    /*                                Create Events                               */
    /* -------------------------------------------------------------------------- */
    console.info(
      "🎪 Creating 30 Indonesian-themed events (3 per organizer)..."
    );

    const eventNamesByCategory = {
      ENTERTAINMENT: [
        "Summer Music Festival",
        "Stand Up Comedy Night",
        "Indie Band Live Concert",
        "Movie Premiere Night",
        "DJ Electronic Party",
        "Open Mic Music Session",
      ],

      SPORTS_AND_COMPETITION: [
        "City Fun Run 10K",
        "National Esports Championship",
        "Basketball 3x3 Tournament",
        "Amateur Badminton Open",
        "Mini Soccer League",
        "Cycling Community Race",
      ],

      EDUCATION_AND_WORKSHOP: [
        "Web Development Bootcamp",
        "UI/UX Design Workshop",
        "Data Analytics Masterclass",
        "Public Speaking Training",
        "Digital Product Management Class",
        "Career Preparation Workshop",
      ],

      BUSSINESS_AND_NETWORKING: [
        "Startup Founder Meetup",
        "Digital Marketing Conference",
        "Business Networking Night",
        "Investor Pitch Day",
        "Entrepreneur Leadership Forum",
        "SME Growth Strategy Summit",
      ],

      ART_AND_CULTURE: [
        "Traditional Dance Performance",
        "Modern Art Exhibition",
        "Photography Gallery Showcase",
        "Cultural Heritage Festival",
        "Theater Drama Performance",
        "Creative Illustration Expo",
      ],
    };

    const allEventNames = Object.values(eventNamesByCategory).flat();
    const categories = Object.values(CategoryOption);
    const locations = Object.values(LocationOption);

    const eventsToCreate = allEventNames.slice(0, 30).map((name, idx) => {
      const organizer =
        createdEventOrganizers[idx % createdEventOrganizers.length];
      const category = categories[Math.floor(idx / 6)] as CategoryOption;
      const location = locations[idx % locations.length] as LocationOption;
      const price = 50_000 + (idx % 10) * 25_000;
      const totalSeats = 100 + (idx % 6) * 10;
      const startTime = faker.date.soon({ days: 30 });
      startTime.setHours(
        faker.number.int({ min: 9, max: 20 }),
        faker.number.int({ min: 0, max: 59 })
      );
      const endTime = new Date(startTime);
      endTime.setHours(
        startTime.getHours() + faker.number.int({ min: 1, max: 4 })
      );
      return {
        eventOrganizerId: organizer!.id,
        name,
        category,
        location,
        price,
        totalSeats,
        availableSeats: totalSeats,
        startTime,
        endTime,
      };
    });

    const createdEvents = await Promise.all(
      eventsToCreate.map((e) => prisma.event.create({ data: e }))
    );

    console.info(`✅ Created ${createdEvents.length} events`);

    /* -------------------------------------------------------------------------- */
    /*                               Create Voucher                               */
    /* -------------------------------------------------------------------------- */
    console.info("🎟️ Creating 1 voucher for each event, total 30 vouchers...");

    const voucherCodes = [
      "EVT-7FQ9K2",
      "EVT-A3M8XZ",
      "EVT-9LQW4P",
      "EVT-XK82JM",
      "EVT-PQ7N5A",
      "EVT-4ZML9C",
      "EVT-J8Q2WX",
      "EVT-NP7A4K",
      "EVT-5MZQ8L",
      "EVT-X4A9PN",
      "EVT-Q7K2M9",
      "EVT-8PAXWL",
      "EVT-ZN4Q5M",
      "EVT-2J7KPX",
      "EVT-LQZ8A4",
      "EVT-9W5PXM",
      "EVT-KA7ZQN",
      "EVT-M4P2WL",
      "EVT-XQ9A7K",
      "EVT-8ZP4MN",
      "EVT-W7LQKP",
      "EVT-MQ82ZX",
      "EVT-5AKP9L",
      "EVT-4N7WXZ",
      "EVT-QP8L2M",
      "EVT-ZX9A7P",
      "EVT-7KM4QN",
      "EVT-PXW9LA",
      "EVT-2ZQK8M",
      "EVT-N4A7PX",
    ];

    const vouchersToCreate = voucherCodes.slice(0, 30).map((code, idx) => {
      const event = createdEvents[idx % createdEvents.length];
      const value = 10_000;
      const validFrom = faker.date.soon({ days: 30 });
      validFrom.setHours(
        faker.number.int({ min: 9, max: 20 }),
        faker.number.int({ min: 0, max: 59 })
      );
      const validUntil = new Date(validFrom);
      validUntil.setHours(
        validFrom.getHours() + faker.number.int({ min: 1, max: 4 })
      );

      return {
        eventId: event!.id,
        code,
        value,
        validFrom,
        validUntil,
      };
    });

    const createdVouchers = await Promise.all(
      vouchersToCreate.map((v) => prisma.voucher.create({ data: v }))
    );

    console.info(`✅ Created ${createdVouchers.length} vouchers`);

    /* -------------------------------------------------------------------------- */
    /*                             Create Event Images                            */
    /* -------------------------------------------------------------------------- */
    console.info("🖼️ Creating 30 event images");

    const imageUrl: string[] = [];

    for (let i = 0; i < 30; i++) {
      imageUrl.push(
        faker.image.url({
          width: 450,
          height: 100,
        })
      );
    }

    const eventImagesToCreate = imageUrl.slice(0, 30).map((url, idx) => {
      const event = createdEvents[idx % createdEvents.length];

      return {
        eventId: event!.id,
        url,
      };
    });

    const createdEventImages = await Promise.all(
      eventImagesToCreate.map((i) => prisma.eventImage.create({ data: i }))
    );

    console.info(`✅ Created ${createdEventImages.length} vouchers`);
    console.info(`🏁 Seeding finished successfully`);
  } catch (error) {
    console.error(`👎 Seeding failed:`, error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
