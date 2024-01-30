/* eslint-disable max-lines */
import type { Prisma } from '@prisma/client';
import { Event, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function processEvents(
  events: Prisma.EventUncheckedCreateInput[],
  processEventFunction: (event: Prisma.EventUncheckedCreateInput) => void,
): void {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year <= 2050; year++) {
    events.forEach((event) => {
      const updatedEvent = { ...event };
      updatedEvent.date = getRandomDateForYear(updatedEvent.date, year);
      updatedEvent.beginTime = getRandomDateForYear(
        updatedEvent.beginTime,
        year,
      );
      updatedEvent.endTime = getRandomDateForYear(updatedEvent.endTime, year);
      updatedEvent.thumbnailUrl += `?random=${randomIntFromInterval(
        1,
        10000000,
      )}`;
      processEventFunction(updatedEvent);
    });
  }
}

function getRandomDateForYear(dateString: Date | string, year: number): Date {
  const date = new Date(dateString);
  date.setFullYear(year);
  date.setMonth(randomIntFromInterval(0, 11));
  date.setDate(randomIntFromInterval(1, daysInMonth(date.getMonth(), year)));
  return date;
}

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

async function main() {
  const states = ['California', 'Florida', 'New York'];

  const locations = await Promise.all(
    states.map(async (state) =>
      prisma.location.create({
        data: {
          state,
        },
      }),
    ),
  );
  console.log('Locations created:', locations.length);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        locationId: locations.find(
          (location) => location.state === 'California',
        )?.id,
        authId: 'richard-blem',
        email: 'richard.blem@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=1',
        name: 'Richard Blem',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find((location) => location.state === 'New York')
          ?.id,
        authId: 'jane-doe',
        email: 'jane.doe@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=2',
        name: 'Jane Doe',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find((location) => location.state === 'Florida')
          ?.id,
        authId: 'john-smith',
        email: 'john.smith@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=3',
        name: 'John Smith',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find((location) => location.state === 'Florida')
          ?.id,
        authId: 'emily-jones',
        email: 'emily.jones@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=4',
        name: 'Emily Jones',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find(
          (location) => location.state === 'California',
        )?.id,
        authId: 'alex-wilson',
        email: 'alex.wilson@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=5',
        name: 'Alex Wilson',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find((location) => location.state === 'New York')
          ?.id,
        authId: 'sarah-jackson',
        email: 'sarah.jackson@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=6',
        name: 'Sarah Jackson',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find(
          (location) => location.state === 'California',
        )?.id,
        authId: 'michael-smith',
        email: 'michael.smith@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=7',
        name: 'Michael Smith',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find((location) => location.state === 'Florida')
          ?.id,
        authId: 'lisa-johnson',
        email: 'lisa.johnson@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=8',
        name: 'Lisa Johnson',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find((location) => location.state === 'New York')
          ?.id,
        authId: 'david-anderson',
        email: 'david.anderson@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=9',
        name: 'David Anderson',
      },
    }),
    prisma.user.create({
      data: {
        locationId: locations.find(
          (location) => location.state === 'California',
        )?.id,
        authId: 'olivia-brown',
        email: 'olivia.brown@fake.com',
        avatarUrl: 'https://i.pravatar.cc/100?random=10',
        name: 'Olivia Brown',
      },
    }),
  ]);
  console.log('Users created:', users.length);

  function getRandomUser() {
    return users[Math.floor(Math.random() * users.length)];
  }

  const events = [
    {
      title: 'New York Fashion Week',
      description:
        "Premiere Fashion Week is an exclusive and highly anticipated event that brings together top designers, models, and fashion enthusiasts from around the world. Showcasing the latest trends and designs, this glamorous affair sets the stage for the upcoming fashion season. With a focus on innovation and creativity, attendees can expect to witness breathtaking runway shows, captivating presentations, and immersive fashion experiences. From elegant couture to cutting-edge streetwear, the event offers a diverse range of styles that cater to every fashion lover's taste. Join us for an unforgettable week of fashion, inspiration, and the celebration of artistry in the heart of New York City.",
      date: '2024-09-10T00:00:00',
      beginTime: '2024-09-10T10:00:00',
      endTime: '2024-09-10T22:00:00',
      address: '800 Fashion Ave, New York, NY, 10001',
      locationId: locations.find((location) => location.state === 'New York')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 250.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Los Angeles Music Festival',
      description:
        'The Los Angeles Music Festival is a multi-day event that showcases a diverse lineup of musical performances across various genres. From rock and pop to hip-hop and electronic music, this festival offers something for every music lover. With multiple stages, food vendors, and interactive experiences, attendees can immerse themselves in the vibrant music scene of Los Angeles. Join us for a weekend of unforgettable performances, good vibes, and the celebration of music.',
      date: '2024-07-20T00:00:00',
      beginTime: '2024-07-20T12:00:00',
      endTime: '2024-07-22T23:59:59',
      address: '123 Music Blvd, Los Angeles, CA, 90001',
      locationId: locations.find((location) => location.state === 'California')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 150.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'San Francisco Tech Expo',
      description:
        "The San Francisco Tech Expo is a premier technology event that showcases the latest innovations in the tech industry. Featuring exhibits from leading tech companies, startups, and thought leaders, the expo is a hub for networking and knowledge sharing. Attendees can participate in workshops, keynote speeches, and panel discussions on cutting-edge topics like AI, cybersecurity, and green tech. Whether you're a tech professional or enthusiast, this event offers a glimpse into the future of technology in the heart of Silicon Valley.",
      date: '2024-05-15T00:00:00',
      beginTime: '2024-05-15T09:00:00',
      endTime: '2024-05-17T18:00:00',
      address: '456 Tech Way, San Francisco, CA, 94102',
      locationId: locations.find((location) => location.state === 'California')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 200.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Miami Beach Art Show',
      description:
        "Join us at the Miami Beach Art Show, a spectacular celebration of contemporary art set against the backdrop of beautiful Miami Beach. This vibrant event features a curated selection of artworks from renowned artists and rising talents. Explore a wide array of paintings, sculptures, and installations, and engage with the artists in interactive sessions. The event also includes live music, art workshops, and delicious local cuisine, making it a perfect blend of art and culture in Florida's most picturesque beach city.",
      date: '2024-03-25T00:00:00',
      beginTime: '2024-03-25T10:00:00',
      endTime: '2024-03-28T20:00:00',
      address: '789 Art St, Miami Beach, FL, 33139',
      locationId: locations.find((location) => location.state === 'Florida')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 80.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Buffalo Food Festival',
      description:
        "The Buffalo Food Festival is a culinary extravaganza, celebrating the diverse and delicious cuisine of New York. This event brings together the best local chefs, food trucks, and restaurants to offer a taste of the region's specialties. From classic Buffalo wings to innovative fusion dishes, the festival is a foodie's paradise. Attendees can enjoy cooking demonstrations, live music, and food competitions, all in a fun and family-friendly atmosphere. Don't miss this opportunity to savor the flavors of New York in the historic city of Buffalo.",
      date: '2024-08-05T00:00:00',
      beginTime: '2024-08-05T11:00:00',
      endTime: '2024-08-07T22:00:00',
      address: '321 Gourmet Ln, Buffalo, NY, 14201',
      locationId: locations.find((location) => location.state === 'New York')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 50.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Orlando Science & Space Conference',
      description:
        'The Orlando Science & Space Conference is a dynamic event that brings together science enthusiasts, researchers, and educators from across the globe. This event features interactive exhibits, engaging workshops, and inspiring talks from leading experts in the fields of astronomy, physics, and environmental science. Attendees can experience the latest in space technology, participate in hands-on science activities, and explore the wonders of the universe. Ideal for families and science buffs alike, this conference offers an educational and entertaining journey into the world of science and space exploration in the heart of Florida.',
      date: '2024-10-18T00:00:00',
      beginTime: '2024-10-18T09:00:00',
      endTime: '2024-10-20T17:00:00',
      address: '101 Space Ave, Orlando, FL, 32801',
      locationId: locations.find((location) => location.state === 'Florida')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 120.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Sacramento Wine & Food Festival',
      description:
        "Experience the best of California's cuisine and wine at the Sacramento Wine & Food Festival. This event showcases a diverse selection of the finest wines from local vineyards, paired with gourmet dishes from top-rated chefs. Attendees can indulge in wine tasting sessions, culinary demonstrations, and exclusive pairing experiences. The festival also features live music, art displays, and a marketplace with artisanal products. Set in the picturesque capital of California, this festival is a must-visit for wine connoisseurs and foodies alike.",
      date: '2024-06-07T00:00:00',
      beginTime: '2024-06-07T12:00:00',
      endTime: '2024-06-09T20:00:00',
      address: '234 Vineyard Rd, Sacramento, CA, 95814',
      locationId: locations.find((location) => location.state === 'California')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 175.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Rochester Film Festival',
      description:
        'The Rochester Film Festival is a celebration of cinematic excellence and innovation in New York. This event features screenings of a diverse range of films, from independent shorts to international blockbusters. Filmmakers, critics, and movie enthusiasts will gather for panel discussions, workshops, and Q&A sessions with industry professionals. The festival provides a platform for emerging talent and fosters a community of film lovers. Join us in Rochester for an immersive experience that honors the art and impact of filmmaking.',
      date: '2024-11-15T00:00:00',
      beginTime: '2024-11-15T14:00:00',
      endTime: '2024-11-20T22:00:00',
      address: '567 Cinema Ave, Rochester, NY, 14607',
      locationId: locations.find((location) => location.state === 'New York')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 100.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'San Diego Comic & Fantasy Convention',
      description:
        "The San Diego Comic & Fantasy Convention is a spectacular gathering for fans of comics, fantasy, and sci-fi. This event features a star-studded lineup of artists, writers, and celebrities from your favorite shows and comics. Attendees can enjoy panel discussions, autograph sessions, cosplay competitions, and exclusive previews of upcoming releases. The convention floor is filled with vendor booths offering unique collectibles, artwork, and memorabilia. This is a must-attend event for pop culture enthusiasts in the heart of California's coastal city.",
      date: '2024-07-25T00:00:00',
      beginTime: '2024-07-25T10:00:00',
      endTime: '2024-07-27T19:00:00',
      address: '321 Fantasy Ln, San Diego, CA, 92101',
      locationId: locations.find((location) => location.state === 'California')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 130.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Tampa Bay Jazz Festival',
      description:
        "Immerse yourself in the rhythms of jazz at the Tampa Bay Jazz Festival, a celebration of jazz music in Florida's vibrant coastal city. The festival features performances by renowned jazz musicians and up-and-coming artists. Set in a scenic outdoor venue, attendees can enjoy the smooth sounds of jazz while experiencing the beautiful Tampa Bay sunset. The event includes food vendors offering local delicacies, making it a perfect blend of music, culture, and cuisine. Don't miss this unforgettable jazz experience in the heart of Florida.",
      date: '2024-04-20T00:00:00',
      beginTime: '2024-04-20T16:00:00',
      endTime: '2024-04-22T23:00:00',
      address: '789 Jazz Rd, Tampa, FL, 33602',
      locationId: locations.find((location) => location.state === 'Florida')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 95.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Albany Literature Festival',
      description:
        "The Albany Literature Festival is a haven for book lovers and writers in New York. This event features book readings, author signings, and panel discussions with bestselling and emerging authors. Attendees can explore a wide range of genres, participate in writing workshops, and engage in conversations about the latest trends in literature. The festival also includes a children's area with storytelling sessions and educational activities. Join us in Albany for a celebration of the written word, creativity, and the joy of reading.",
      date: '2024-09-05T00:00:00',
      beginTime: '2024-09-05T10:00:00',
      endTime: '2024-09-07T18:00:00',
      address: '456 Book St, Albany, NY, 12207',
      locationId: locations.find((location) => location.state === 'New York')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 40.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Napa Valley Wine & Harvest Festival',
      description:
        "Celebrate the bounty of the season at the Napa Valley Wine & Harvest Festival in California. This event is a tribute to the region's renowned winemaking tradition, featuring tastings from top Napa Valley wineries. Enjoy a variety of local gourmet food, live music, and wine seminars. The festival also includes vineyard tours, grape stomping, and artisan markets, offering a complete sensory experience. It's the perfect event for wine enthusiasts looking to explore the rich flavors and culture of Napa Valley.",
      date: '2024-10-05T00:00:00',
      beginTime: '2024-10-05T11:00:00',
      endTime: '2024-10-08T20:00:00',
      address: '123 Vine St, Napa, CA, 94559',
      locationId: locations.find((location) => location.state === 'California')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 210.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Key West Seafood Festival',
      description:
        "Dive into the fresh flavors of the ocean at the Key West Seafood Festival in Florida. This vibrant event showcases the best of the region's seafood, with a focus on sustainable and locally-sourced ingredients. Attendees can enjoy a wide range of seafood dishes, cooking demonstrations, and live entertainment. The festival also features boat tours, fishing competitions, and a marketplace for artisanal goods. It's a must-visit for seafood lovers and those looking to experience the unique coastal culture of Key West.",
      date: '2024-01-15T00:00:00',
      beginTime: '2024-01-15T10:00:00',
      endTime: '2024-01-17T18:00:00',
      address: '789 Ocean Dr, Key West, FL, 33040',
      locationId: locations.find((location) => location.state === 'Florida')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 85.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Syracuse International Auto Show',
      description:
        "The Syracuse International Auto Show is a must-see event for car enthusiasts in New York. This show features the latest models, concept cars, and classic vehicles from renowned manufacturers worldwide. Attendees can explore a wide range of automobiles, participate in interactive exhibits, and meet industry experts. The event also includes test drives, performance showcases, and technology demonstrations. It's an exciting opportunity to see the newest innovations and designs in the automotive world.",
      date: '2024-02-20T00:00:00',
      beginTime: '2024-02-20T09:00:00',
      endTime: '2024-02-23T19:00:00',
      address: '321 Auto Ln, Syracuse, NY, 13202',
      locationId: locations.find((location) => location.state === 'New York')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 150.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Los Angeles International Film Festival',
      description:
        'The Los Angeles International Film Festival is an illustrious event celebrating the art of filmmaking. This festival showcases a diverse collection of films from around the globe, including feature films, documentaries, and shorts. Attendees can experience exclusive screenings, red-carpet premieres, and Q&A sessions with filmmakers and actors. The festival also offers workshops and networking events for aspiring filmmakers. Join us in the heart of Hollywood for an unforgettable celebration of cinema and storytelling.',
      date: '2024-11-10T00:00:00',
      beginTime: '2024-11-10T10:00:00',
      endTime: '2024-11-15T23:59:59',
      address: '123 Cinema Blvd, Los Angeles, CA, 90028',
      locationId: locations.find((location) => location.state === 'California')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 200.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Fort Lauderdale Boat Show',
      description:
        "Join the maritime celebration at the Fort Lauderdale Boat Show, Florida's premier boating event. This show features an impressive array of yachts, speedboats, fishing boats, and marine accessories from top international manufacturers. Visitors can enjoy boat tours, live demonstrations, and seminars on boating and marine conservation. The event also includes a variety of waterfront activities, making it a perfect outing for boat enthusiasts and families alike. Experience the luxury and adventure of the boating lifestyle in Fort Lauderdale.",
      date: '2024-10-25T00:00:00',
      beginTime: '2024-10-25T09:00:00',
      endTime: '2024-10-29T18:00:00',
      address: '789 Marina Blvd, Fort Lauderdale, FL, 33312',
      locationId: locations.find((location) => location.state === 'Florida')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 120.0,
      organizerId: getRandomUser().id,
    },
    {
      title: 'Ithaca Nature & Wildlife Festival',
      description:
        'The Ithaca Nature & Wildlife Festival in New York is a celebration of the natural world. This family-friendly event offers a variety of outdoor activities, including guided nature walks, wildlife presentations, and environmental education workshops. Attendees can explore local flora and fauna, participate in bird watching tours, and learn about conservation efforts. The festival also features local food vendors, live music, and craft stalls, providing a fun and educational experience for nature lovers of all ages.',
      date: '2024-05-15T00:00:00',
      beginTime: '2024-05-15T09:00:00',
      endTime: '2024-05-17T17:00:00',
      address: '321 Nature Trail, Ithaca, NY, 14850',
      locationId: locations.find((location) => location.state === 'New York')
        ?.id,
      thumbnailUrl: 'https://source.unsplash.com/1125x555',
      price: 50.0,
      organizerId: getRandomUser().id,
    },
  ];

  const processedEvents: Prisma.EventUncheckedCreateInput[] = [];
  processEvents(events, (event) => {
    processedEvents.push(event);
  });

  await prisma.event.createMany({
    data: processedEvents,
  });
  const createdEvents = await prisma.event.findMany();
  console.log('Events created:', createdEvents.length);

  const mapOfTickets = createdEvents.map((event) => {
    const randomSelectedUsersIds: string[] = [];
    const nbOfTickets = randomIntFromInterval(0, 6);
    while (randomSelectedUsersIds.length < nbOfTickets) {
      const randomUser = getRandomUser();
      if (!randomSelectedUsersIds.includes(randomUser.id)) {
        randomSelectedUsersIds.push(randomUser.id);
      }
    }
    return randomSelectedUsersIds.map((userId) => ({
      userId,
      eventId: event.id,
    }));
  });
  const tickets = mapOfTickets.flat();
  await prisma.ticket.createMany({
    data: tickets,
  });

  console.log('Tickets created:', tickets.length);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
