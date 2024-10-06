import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // TODO: Implement seed data. Currently we seed the db with production data.

  // const topicHypocrisy = await prisma.topic.create({
  //   data: {
  //     name: 'Hypocrisy',
  //   },
  // });

  // const topicUnity = await prisma.topic.create({
  //   data: {
  //     name: 'Church Unity',
  //   },
  // });

  // const firstCorinthiansThreeSeventeen = await prisma.bibleReference.create({
  //   data: {
  //     book: '1CO',
  //     chapter: 3,
  //     verse: 17,
  //   },
  // });

  // const firstTimothySixEleven = await prisma.bibleReference.create({
  //   data: {
  //     book: '1TI',
  //     chapter: 6,
  //     verse: 11,
  //   },
  // });

  // const firstTimothySixTwelve = await prisma.bibleReference.create({
  //   data: {
  //     book: '1TI',
  //     chapter: 6,
  //     verse: 12,
  //   },
  // });

  // const chan = await prisma.creator.create({
  //   data: {
  //     firstName: 'Francis',
  //     lastName: 'Chan',
  //     fullName: 'Francis Chan',
  //     description:
  //       'Francis Chan is an American preacher. He is the former teaching pastor of Cornerstone Community Church in Simi Valley, California, a church he and his wife started in 1994. He is also the Founder and Chancellor of Eternity Bible College and author of the best-selling book, Crazy Love: Overwhelmed by a Relentless God.',
  //     sermons: {
  //       create: [
  //         {
  //           title: 'Are You Destroying The Church',
  //           audioUrl:
  //             'https://www.sermonindex.net/modules/mydownloads/visit.php?lid=28279',
  //           hits: 3889,
  //           description: `Francis Chan speaks on a very important subject of Church Unity and the sacredness of the Church. This message warns as the Scripture does: "If anyone destroys God’s temple, God will destroy that person; for God’s temple is sacred." In the body of Christ in North America especially there is a great need to hear this message. To see God's people as holy and all of us as a body of Christ together and not to bite and devour one another as we are wounding Christ Himself who we share in.`,
  //           topics: {
  //             connect: [{ name: topicUnity.name }],
  //           },
  //           bibleReferences: {
  //             connect: [{ id: firstCorinthiansThreeSeventeen.id }],
  //           },
  //         },
  //         {
  //           title: 'Fighting Hypocrisy in the Church',
  //           audioUrl:
  //             'https://www.sermonindex.net/modules/mydownloads/visit.php?lid=20927',
  //           hits: 9433,
  //           topics: {
  //             connect: [{ name: topicHypocrisy.name }],
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });

  // const poonen = await prisma.creator.create({
  //   data: {
  //     firstName: 'Zac',
  //     lastName: 'Poonen',
  //     fullName: 'Zac Poonen',
  //     description:
  //       'Zac Poonen was formerly an Indian Naval Officer who has been serving the Lord in India for over 50 years as a Bible-teacher. He has responsibility for a number of churches in India and abroad.',
  //     sermons: {
  //       create: [
  //         {
  //           title: 'Reality in the Christian Life',
  //           audioUrl: '',
  //           hits: 0,
  //           description: `Zac Poonen shares with the power of the Holy Spirit a message from the heart of God that will show you real Christianity. He speaks against the hyprocrisy that is so prevalent with so many Christians. God's grace leads to holiness and godliness, that is where the peace of God is. May we all be honest with full sincerity before God today no matter how long we have been in ministry.`,
  //           topics: {
  //             connect: [{ name: topicHypocrisy.name }],
  //           },
  //           bibleReferences: {
  //             connect: [
  //               { id: firstTimothySixEleven.id },
  //               { id: firstTimothySixTwelve.id },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });

  console.log('Test data created.');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
