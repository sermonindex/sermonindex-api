const textSermonBooks = [
  'Development of Antichrist',
  'The Gospel pointing to the Person of Christ',
  'Types of the Tabernacle',
  'In the Pursuit of God',
  'Man - The Dwelling Place of God',
  'THE POWER OF GOD IN A REDEEMED LIFE',
  "The Christian's Secret to a Happy Life",
  'Collection of A W Tozer’s Prayers',
  'Power From On High',
  'You Will Never Be The Same',
  'The Feast Of Tabernacles',
  'Evening And Morning',
  'Feed My Sheep',
  'Grace Abounding to the Chief of Sinners',
  "Mr. John Bunyan's Dying Sayings",
  'War On The Saints',
  'Journal Excerpts',
  "Narrative of the Lord's Dealings with George Muller",
  'Practical Religion',
  'Warnings To the Churches',
  'THE SEVEN FUNDAMENTALS OF SPIRITUAL GROWTH',
  'Getting Back To Basics',
  'GENUINE REPENTANCE',
  'Consider Jesus',
  'MORNING THOUGHTS',
  'Abraham, My Friend',
  'Letter of Antony',
  'CATECHISM',
  'RANTERS',
  'The Spirit of Prayer ',
  'The Way to Divine Knowledge',
  'An Humble, Earnest and Affectionate Address to the Clergy',
  'MORNING WATCH',
  'SOUL HELP',
  'Fix your eyes on Jesus',
  'The Day of Doom', //hymn
  'A True Hymn', //hymn
  'CONFESSIONS',
  'Ascent of Mount Carmel',
  'Trophimus I Left Sick',
  'Hell and Everlasting Punishment',
  'The Doctrine of Nonaccumulation',
  'Dear Pastor: Divorce and Remarriage',
  'Primitive Christianity Revived',
  'Objections To Calvanism',
  'One Day at a Time',
  'The Sovereignty of God',
  'CAUSE OF GOD AND TRUTH',
  'The Total Depravity of Man',
  'THE LORD’S PRAYER  Chapter',
  'The Satisfaction of Christ Studies in the Atonement',
  'The Journal Of Charles Wesley',
  'The Secret of the Strength',
  'The Revelation',
  'Disciple-Making Minister',
  'One Day at a Time',
  'Radiant Glory',
  '(Salvation)',
  '(Second Work of Grace)',
  'THE INCARNATION OF THE WORD OF GOD',
  'Prayerbook - Part',
  'Prayers For Public',
  'THE HOLY SPIRIT  Chapter',
  'Exposition of the Gospel of John',
  'THE DOCTRINE OF REVELATION',
  'THE DOCTRINE OF RECONCILIATION',
  'THE DOCTRINE OF MAN’S IMPOTENCE',
  'The Divine Inspiration of the Bible',
  'The Antichrist',
  'REGENERATION OR THE NEW BIRTH',
  'PRACTICAL CHRISTIANITY',
  'Meditations on First Peter',
  'Re-Reading the Book of Acts',
  '(The Final Triumph)',
  'THE INCARNATION OF THE WORD OF GOD',
  'The Ancient Fathers of the Desert',
  'The Book of Enoch',
  'What is it that Saves a Soul',
  'PEARLS from PHILPOT',
  'RICHES of J. C. PHILPOT',
  'DAILY PORTIONS',
  "DAILY WORDS FOR ZION'S WAYFARERS",
  'The way of the Pilgrim and The pilgrim continues his Way',
  '(The Ladder of Divine Ascent)',
  'The Philokali Volume',
];
// id 596, 446, 597 | 598, 600, 601 hyms

const textSermonCommentaries = [
  'Expository Thoughts On', // -> J.C. Ryle (missing some of mathhew)
  'Matthew chapter', // -> J.C. Ryle (only matthew)
  'Adam Clarke Commentary',
];

// Matthew Henry's Commentary on the Whole Bible
const mh_commentary_whole_bible = [
  {
    xoops_sermon_text: [
      {
        id: 8172,
        category_id: 507,
        title: 'Genesis to Deuteronomy',
      },
      {
        id: 8173,
        category_id: 507,
        title: 'Joshua to Esther',
      },
      {
        id: 8174,
        category_id: 507,
        title: 'Job to Song of Solomon',
      },
      {
        id: 8175,
        category_id: 507,
        title: 'Isaiah to Malachi',
      },
      {
        id: 8176,
        category_id: 507,
        title: 'Matthew to John',
      },
      {
        id: 8177,
        category_id: 507,
        title: 'Acts to Revelation',
      },
    ],
  },
];

const commentaries = [
  {
    id: 6,
    name: 'A Commentary On Acts Of The Apostles',
    author_id: 6,
  },
  {
    id: 134,
    name: 'Commentary On The Apocolypse Of The Blessed John',
    author_id: 52,
  },
  {
    id: 192,
    name: 'Origens Commentary On The Gospel Of John',
    author_id: 29,
  },
  {
    id: 193,
    name: 'Origens Commentary On The Gospel Of Matthew',
    author_id: 29,
  },
  {
    id: 195,
    name: 'Commentary On Revelation',
    author_id: 60,
  },
  {
    id: 210,
    name: 'Calvin Commentaries',
    author_id: 74,
  },
  {
    id: 211,
    name: 'Commentary On Genesis Volume 1',
    author_id: 74,
  },
  {
    id: 212,
    name: 'Commentary On Genesis Volume 2',
    author_id: 74,
  },
  {
    id: 217,
    name: 'Commentary On Joshua',
    author_id: 74,
  },
  {
    id: 218,
    name: 'Commentary On Psalms Volume 1',
    author_id: 74,
  },
  {
    id: 219,
    name: 'Commentary On Psalms Volume 2',
    author_id: 74,
  },
  {
    id: 220,
    name: 'Commentary On Psalms Volume 3',
    author_id: 74,
  },
  {
    id: 221,
    name: 'Commentary On Psalms Volume 4',
    author_id: 74,
  },
  {
    id: 222,
    name: 'Commentary On Psalms Volume 5',
    author_id: 74,
  },
  {
    id: 223,
    name: 'Commentary On Isaiah Volume 1',
    author_id: 74,
  },
  {
    id: 224,
    name: 'Commentary On Isaiah Volume 2',
    author_id: 74,
  },
  {
    id: 225,
    name: 'Commentary On Isaiah Volume 3',
    author_id: 74,
  },
  {
    id: 226,
    name: 'Commentary On Isaiah Volume 4',
    author_id: 74,
  },
  {
    id: 227,
    name: 'Commentary On Jeremiah And Lamentations Volume 1',
    author_id: 74,
  },
  {
    id: 228,
    name: 'Commentary On Jeremiah And Lamentations Volume 2',
    author_id: 74,
  },
  {
    id: 229,
    name: 'Commentary On Jeremiah And Lamentations Volume 3',
    author_id: 74,
  },
  {
    id: 230,
    name: 'Commentary On Jeremiah And Lamentations Volume 4',
    author_id: 74,
  },
  {
    id: 231,
    name: 'Commentary On Jeremiah And Lamentations Volume 5',
    author_id: 74,
  },
  {
    id: 232,
    name: 'Commentary On Ezekiel Volume 1',
    author_id: 74,
  },
  {
    id: 233,
    name: 'Commentary On Ezekiel Volume 2',
    author_id: 74,
  },
  {
    id: 234,
    name: 'Commentary On Daniel Volume 1',
    author_id: 74,
  },
  {
    id: 235,
    name: 'Commentary On Daniel Volume 2',
    author_id: 74,
  },
  {
    id: 236,
    name: 'Commentary On Hosea',
    author_id: 74,
  },
  {
    id: 237,
    name: 'Commentary On Joel Amos Obadiah',
    author_id: 74,
  },
  {
    id: 238,
    name: 'Commentary On Jonah Micah Nahum',
    author_id: 74,
  },
  {
    id: 239,
    name: 'Commentary On Habakkuk Zephaniah Haggai',
    author_id: 74,
  },
  {
    id: 240,
    name: 'Commentary On Zechariah Malachi',
    author_id: 74,
  },
  {
    id: 241,
    name: 'Commentary On Matthew Mark Luke Volume 1',
    author_id: 74,
  },
  {
    id: 242,
    name: 'Commentary On Matthew Mark Luke Volume 2',
    author_id: 74,
  },
  {
    id: 243,
    name: 'Commentary On Matthew Mark Luke Volume 3',
    author_id: 74,
  },
  {
    id: 244,
    name: 'Commentary On John Volume 1',
    author_id: 74,
  },
  {
    id: 245,
    name: 'Commentary On John Volume 2',
    author_id: 74,
  },
  {
    id: 246,
    name: 'Commentary On Acts Volume 1',
    author_id: 74,
  },
  {
    id: 247,
    name: 'Commentary On Acts Volume 2',
    author_id: 74,
  },
  {
    id: 248,
    name: 'Commentary On Romans',
    author_id: 74,
  },
  {
    id: 249,
    name: 'Commentary On Corinthians Volume 1',
    author_id: 74,
  },
  {
    id: 250,
    name: 'Commentary On Corinthians Volume 2',
    author_id: 74,
  },
  {
    id: 251,
    name: 'Commentary On Galatians And Ephesians',
    author_id: 74,
  },
  {
    id: 252,
    name: 'Commentary On Philippians Colossians And Thessalonians',
    author_id: 74,
  },
  {
    id: 253,
    name: 'Commentary On Timothy Titus Philemon',
    author_id: 74,
  },
  {
    id: 254,
    name: 'Commentary On Hebrews',
    author_id: 74,
  },
  {
    id: 255,
    name: 'Commentaries On The Catholic Epistles',
    author_id: 74,
  },
  {
    id: 365,
    name: 'Commentary Critical And Explanatory On The Whole Bible',
    author_id: 133,
  },
  {
    id: 366,
    name: 'The New Testament Commentary Vol Iii John',
    author_id: 134,
  },
  {
    id: 392,
    name: 'Matthew Henrys Concise Commentary On The Bible',
    author_id: 149,
  },
  {
    id: 769,
    name: 'A Brief Commentary On The Apocalypse',
    author_id: 332,
  },
  {
    id: 795,
    name: 'Commentary On Genesis Vol Ii',
    author_id: 107,
  },
];

const hymns = [
  {
    id: 196,
    name: 'Hymns Of The Apostolic Church',
    author_id: 61,
  },
  {
    id: 293,
    name: 'Hymns Of The Early Church',
    author_id: 61,
  },
  {
    id: 294,
    name: 'Hymns Of The Eastern Church',
    author_id: 94,
  },
  {
    id: 295,
    name: 'Hymns Of The Holy Eastern Church',
    author_id: 61,
  },
  {
    id: 297,
    name: 'The Hymnal Of The Protestant Episcopal Church In The Usa',
    author_id: 53,
  },
  {
    id: 326,
    name: 'Hymns Of The Greek Church',
    author_id: 61,
  },
  {
    id: 340,
    name: 'Hymns From The Land Of Luther',
    author_id: 122,
  },
  {
    id: 349,
    name: 'Hymns And Meditations',
    author_id: 125,
  },
  {
    id: 350,
    name: 'Hymns And Hymnwriters Of Denmark',
    author_id: 126,
  },
  {
    id: 351,
    name: 'Hymns From The East',
    author_id: 61,
  },
  {
    id: 352,
    name: 'Hymns From The Morningland',
    author_id: 61,
  },
  {
    id: 353,
    name: 'Hymn Writers Of The Church',
    author_id: 127,
  },
  {
    id: 391,
    name: 'The Hymns Of Methodism In Their Literary Relations',
    author_id: 148,
  },
  {
    id: 462,
    name: 'Hymns And Homilies Of Ephraim The Syrian',
    author_id: 171,
  },
  {
    id: 467,
    name: 'Olney Hymns',
    author_id: 147,
  },
  {
    id: 492,
    name: 'The Psalms And Hymns Of Isaac Watts',
    author_id: 93,
  },
  {
    id: 504,
    name: 'Hymns Of The Russian Church',
    author_id: 61,
  },
  {
    id: 505,
    name: 'Sacred Poems And Hymns',
    author_id: 192,
  },
  {
    id: 527,
    name: 'Hymns Of Ter Steegen Suso And Others',
    author_id: 110,
  },
  {
    id: 528,
    name: 'Hymns Of Ter Steegen And Others Second Series',
    author_id: 110,
  },
  {
    id: 545,
    name: 'Favourite Welsh Hymns',
    author_id: 204,
  },
  {
    id: 546,
    name: 'The Hymns Of Wesley And Watts Five Papers',
    author_id: 205,
  },
  {
    id: 598,
    name: 'Hymns And Spiritual Songs',
    author_id: 93,
  },
  {
    id: 614,
    name: 'The Hymns Of Prudentius',
    author_id: 234,
  },
  {
    id: 632,
    name: 'The Otterbein Hymnal',
    author_id: 248,
  },
  {
    id: 661,
    name: 'The Story Of The Hymns And Tunes',
    author_id: 215,
  },
  {
    id: 671,
    name: 'Hymns For Christian Devotion',
    author_id: 265,
  },
  {
    id: 683,
    name: 'A Practical Discourse On Some Principles Of Hymn-singing',
    author_id: 272,
  },
  {
    id: 708,
    name: 'The St Gregory Hymnal And Catholic Choir Book',
    author_id: 53,
  },
  {
    id: 845,
    name: 'Indian Methodist Hymn-book',
    author_id: 53,
  },
  {
    id: 855,
    name: 'A Collection Of Gospel Hymns In Ojibway And English',
    author_id: 75,
  },
  {
    id: 857,
    name: 'Christian Hymns Of The First Three Centuries',
    author_id: 371,
  },
  {
    id: 858,
    name: 'Book Of Hymns For Public And Private Devotion',
    author_id: 53,
  },
  {
    id: 921,
    name: 'The Hymns Of Martin Luther',
    author_id: 120,
  },
];

const catechisms = [
  {
    id: 346,
    name: 'The Heidelberg Catechism ',
    author_id: 53,
  },
  {
    id: 372,
    name: 'The Large Catechism',
    author_id: 107,
  },
  {
    id: 547,
    name: 'The Westminster Shorter Catechism',
    author_id: 75,
  },
  {
    id: 548,
    name: 'The Westminster Larger Catechism',
    author_id: 75,
  },
  {
    id: 613,
    name: 'Baltimore Catechism No 4',
    author_id: 233,
  },
  {
    id: 638,
    name: 'The Small Catechism Of Martin Luther',
    author_id: 107,
  },
];

const devotionals = [
  {
    id: 280,
    name: 'Daily Light On The Daily Path',
    author_id: 75,
  },
  {
    id: 675,
    name: 'Daily Thoughts ',
    author_id: 208,
  },
  {
    id: 705,
    name: 'My Daily Meditation For The Circling Year',
    author_id: 287,
  },
];
