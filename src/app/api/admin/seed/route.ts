import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin, unauthorized } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-error";

const BIBLE_COURSES = [
  {
    title: "The Book of Genesis",
    slug: "book-of-genesis",
    level: "intro",
    isPublished: true,
    description: "Explore the book of Genesis — the foundation of the biblical story. This course covers creation, humanity, covenant, and God's promises. | Adapted from BibleProject (CC BY-NC 4.0)",
    creditText: "Content adapted from BibleProject (CC BY-NC 4.0). Video lessons sourced from BibleProject's YouTube channel.",
    order: 0,
    lessons: [
      { title: "Genesis 1-11: The Beginning", description: "Creation, fall, flood, and the Tower of Babel.", youtubeId: "GQI72THyO5I", order: 0, questions: [
        { question: "What did God create on day four?", options: ["Sun, moon, and stars", "Plants and trees", "Fish and birds", "Animals"], correctAnswer: 0, order: 0 },
        { question: "What did God create humans from according to Genesis 2?", options: ["Dust of the ground", "The breath of the sea", "A rib from an animal", "Clay from the river"], correctAnswer: 0, order: 1 },
        { question: "What was the sign of God's covenant with Noah?", options: ["A rainbow", "A dove", "An altar", "A tree"], correctAnswer: 0, order: 2 },
        { question: "How many days did God create the world in?", options: ["Six days", "Seven days", "Five days", "Ten days"], correctAnswer: 0, order: 3 },
        { question: "What language were humans speaking before the Tower of Babel?", options: ["One common language", "Hebrew", "Aramaic", "Sumerian"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Genesis 12-25: Abraham", description: "God's covenant with Abraham, faith, and the promise of a nation.", youtubeId: "F4isSyennFo", order: 1, questions: [
        { question: "Where did God call Abraham to go?", options: ["To a land He would show him", "To Egypt", "To Ur", "To Canaan"], correctAnswer: 0, order: 0 },
        { question: "How old was Abraham when Isaac was born?", options: ["100", "75", "90", "120"], correctAnswer: 0, order: 1 },
        { question: "What did God promise Abraham?", options: ["Descendants as numerous as the stars", "Wealth and power", "A long life", "Victory over enemies"], correctAnswer: 0, order: 2 },
        { question: "What did Abraham prepare to sacrifice?", options: ["Isaac", "A lamb", "A bull", "His own life"], correctAnswer: 0, order: 3 },
        { question: "Who was Abraham's first son?", options: ["Ishmael", "Isaac", "Jacob", "Esau"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Genesis 26-50: Jacob and Joseph", description: "Jacob's journey and Joseph's story of redemption.", youtubeId: "F4isSyennFo", order: 2, questions: [
        { question: "What was Jacob's name changed to?", options: ["Israel", "Isaac", "Abraham", "Joseph"], correctAnswer: 0, order: 0 },
        { question: "How many sons did Jacob have?", options: ["12", "10", "14", "7"], correctAnswer: 0, order: 1 },
        { question: "What did Joseph's brothers do to him?", options: ["Sold him into slavery", "Killed him", "Set him free", "Made him king"], correctAnswer: 0, order: 2 },
        { question: "Where did Joseph become a ruler?", options: ["Egypt", "Canaan", "Babylon", "Assyria"], correctAnswer: 0, order: 3 },
        { question: "What did Joseph tell his brothers at the end?", options: ["You meant evil but God meant good", "I forgive you", "Leave this land", "Go and sin no more"], correctAnswer: 0, order: 4 },
      ]},
    ],
  },
  {
    title: "The Gospel of Luke",
    slug: "gospel-of-luke",
    level: "intro",
    description: "Walk through the Gospel of Luke — Jesus' life, teachings, parables, and mission. | Adapted from BibleProject (CC BY-NC 4.0)",
    creditText: "Content adapted from BibleProject (CC BY-NC 4.0). Video lessons sourced from BibleProject's YouTube channel.",
    order: 1,
    lessons: [
      { title: "Who Is Jesus?", description: "The identity and mission of Jesus as presented in Luke.", youtubeId: "XIb_dCIxzr0", order: 0, questions: [
        { question: "What is unique about Luke's Gospel?", options: ["It emphasizes Jesus' humanity and compassion", "It focuses only on miracles", "It skips Jesus' birth", "It is the shortest Gospel"], correctAnswer: 0, order: 0 },
        { question: "Who did Luke write his Gospel for?", options: ["Theophilus", "The Romans", "The Jews", "The Pharisees"], correctAnswer: 0, order: 1 },
        { question: "Which parable is unique to Luke?", options: ["The Good Samaritan", "The Prodigal Son", "Both A and B", "The Mustard Seed"], correctAnswer: 2, order: 2 },
        { question: "What does Jesus emphasize in Luke's Gospel?", options: ["Care for the poor and outcast", "Strict law-keeping", "Political rebellion", "Temple sacrifice"], correctAnswer: 0, order: 3 },
        { question: "How does Luke's Gospel begin?", options: ["With a dedication to Theophilus", "With Jesus' birth", "With John the Baptist", "With creation"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Parables and Teachings", description: "Key parables of Jesus recorded in Luke.", youtubeId: "26z_KhwNdD8", order: 1, questions: [
        { question: "What is a parable?", options: ["A story with a spiritual meaning", "A historical account", "A prophecy", "A law"], correctAnswer: 0, order: 0 },
        { question: "In the Good Samaritan, who helped the injured man?", options: ["A Samaritan", "A priest", "A Levite", "A Pharisee"], correctAnswer: 0, order: 1 },
        { question: "What did the prodigal son waste his inheritance on?", options: ["Foolish living", "Charity", "Building a house", "Paying taxes"], correctAnswer: 0, order: 2 },
        { question: "What was the father's reaction when the prodigal son returned?", options: ["He ran to him and embraced him", "He was angry", "He ignored him", "He sent him away"], correctAnswer: 0, order: 3 },
        { question: "What does the Parable of the Sower teach about?", options: ["How different people respond to God's word", "Farming techniques", "Wealth management", "Community living"], correctAnswer: 0, order: 4 },
      ]},
      { title: "The Passion and Resurrection", description: "Jesus' suffering, death, and resurrection in Luke.", youtubeId: "26z_KhwNdD8", order: 2, questions: [
        { question: "What happened when Jesus died according to Luke?", options: ["The sun stopped shining", "An earthquake occurred", "The temple veil tore", "All of the above"], correctAnswer: 3, order: 0 },
        { question: "Who was the first person at the empty tomb?", options: ["Mary Magdalene and other women", "Peter", "John", "Joseph of Arimathea"], correctAnswer: 0, order: 1 },
        { question: "Where did Jesus appear after His resurrection in Luke?", options: ["On the road to Emmaus", "In the temple", "At the sea", "On a mountain"], correctAnswer: 0, order: 2 },
        { question: "What did Jesus eat with His disciples after resurrection?", options: ["Fish", "Bread and wine", "Fruit", "Meat"], correctAnswer: 0, order: 3 },
        { question: "Where did Jesus ascend to heaven?", options: ["Bethany", "Jerusalem", "Galilee", "Mount Sinai"], correctAnswer: 0, order: 4 },
      ]},
    ],
  },
  {
    title: "How to Read the Bible",
    slug: "how-to-read-the-bible",
    level: "intro",
    description: "Learn how to read, understand, and apply the Bible in your daily life. | Adapted from BibleProject (CC BY-NC 4.0)",
    creditText: "Content adapted from BibleProject (CC BY-NC 4.0). Video lessons sourced from BibleProject's YouTube channel.",
    order: 2,
    lessons: [
      { title: "What Is the Bible?", description: "Understanding the structure, genres, and overarching story of the Bible.", youtubeId: "ak06MSETeo4", order: 0, questions: [
        { question: "How many books are in the Protestant Bible?", options: ["66", "73", "39", "27"], correctAnswer: 0, order: 0 },
        { question: "What are the two main divisions of the Bible?", options: ["Old Testament and New Testament", "Law and Prophets", "History and Poetry", "Gospels and Letters"], correctAnswer: 0, order: 1 },
        { question: "How many books are in the Old Testament?", options: ["39", "27", "66", "46"], correctAnswer: 0, order: 2 },
        { question: "How many books are in the New Testament?", options: ["27", "39", "21", "66"], correctAnswer: 0, order: 3 },
        { question: "What languages was the Bible originally written in?", options: ["Hebrew, Aramaic, and Greek", "Latin and Greek", "Hebrew and Latin", "Aramaic and Greek"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Literary Genres in the Bible", description: "Identifying and interpreting different genres of biblical literature.", youtubeId: "oUXJ8Owes8E", order: 1, questions: [
        { question: "Which genre includes Psalms and Proverbs?", options: ["Poetry/Wisdom", "Law", "History", "Prophecy"], correctAnswer: 0, order: 0 },
        { question: "Which genre tells the story of Israel and the early church?", options: ["Narrative/History", "Poetry", "Apocalyptic", "Epistle"], correctAnswer: 0, order: 1 },
        { question: "What are the Gospels?", options: ["Biographical accounts of Jesus' life", "Letters to churches", "Prophecies", "Law books"], correctAnswer: 0, order: 2 },
        { question: "What type of writing is the book of Revelation?", options: ["Apocalyptic", "History", "Poetry", "Law"], correctAnswer: 0, order: 3 },
        { question: "What are the letters of Paul called?", options: ["Epistles", "Gospels", "Prophecies", "Psalms"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Biblical Interpretation", description: "Principles for interpreting Scripture faithfully.", youtubeId: "dLFCE8z__hw", order: 2, questions: [
        { question: "What is the most important rule of biblical interpretation?", options: ["Context is king", "The Bible is literal", "Only scholars can interpret", "Any interpretation is valid"], correctAnswer: 0, order: 0 },
        { question: "What does 'exegesis' mean?", options: ["Drawing meaning out of the text", "Reading meaning into the text", "Translating the text", "Summarizing the text"], correctAnswer: 0, order: 1 },
        { question: "What is the opposite of exegesis?", options: ["Eisegesis", "Hermeneutics", "Allegory", "Typology"], correctAnswer: 0, order: 2 },
        { question: "What should you consider when interpreting a Bible passage?", options: ["Historical context, literary context, and audience", "Only the literal words", "What makes you feel good", "Tradition alone"], correctAnswer: 0, order: 3 },
        { question: "What is typology in biblical interpretation?", options: ["Seeing patterns that point to Christ", "Reading the Bible literally", "Allegorical interpretation", "Historical criticism"], correctAnswer: 0, order: 4 },
      ]},
    ],
  },
  {
    title: "The Apostles' Creed",
    slug: "apostles-creed",
    level: "advanced",
    description: "A deep study of the Apostles' Creed — the foundation of Christian doctrine. | Adapted from ThirdMill.org",
    creditText: "Content adapted from ThirdMill.org. Used with permission. Original material available at thirdmill.org.",
    order: 3,
    lessons: [
      { title: "I Believe in God the Father", description: "Exploring the first article of the Creed: God as Creator and Father.", youtubeId: "7_CGP-12AE0", order: 0, questions: [
        { question: "What does the Apostles' Creed begin with?", options: ["I believe in God the Father Almighty", "I believe in Jesus Christ", "I believe in the Holy Spirit", "I believe in the Church"], correctAnswer: 0, order: 0 },
        { question: "What does 'Maker of heaven and earth' affirm?", options: ["God created all things", "God only created heaven", "God only created earth", "Creation was accidental"], correctAnswer: 0, order: 1 },
        { question: "What does calling God 'Father' emphasize?", options: ["God's personal relationship with believers", "God's distance from creation", "God's judgment only", "God's hiddenness"], correctAnswer: 0, order: 2 },
        { question: "What does 'Almighty' tell us about God?", options: ["God has all power", "God has limited power", "God chooses not to act", "God delegates power"], correctAnswer: 0, order: 3 },
        { question: "What is the biblical basis for God as Creator?", options: ["Genesis 1-2", "The Ten Commandments", "The Psalms", "The Prophets"], correctAnswer: 0, order: 4 },
      ]},
      { title: "I Believe in Jesus Christ", description: "The second article: the person and work of Jesus Christ.", youtubeId: "ak06MSETeo4", order: 1, questions: [
        { question: "What does 'His only Son, our Lord' affirm?", options: ["Jesus is the unique Son of God", "Jesus is a created being", "Jesus is an angel", "Jesus is merely a prophet"], correctAnswer: 0, order: 0 },
        { question: "What does 'conceived by the Holy Spirit, born of the Virgin Mary' affirm?", options: ["Jesus is fully God and fully man", "Jesus was only divine", "Jesus was only human", "Jesus was adopted as God's Son"], correctAnswer: 0, order: 1 },
        { question: "Why did Jesus suffer under Pontius Pilate?", options: ["To atone for our sins", "Because He was a criminal", "Because He failed", "By accident"], correctAnswer: 0, order: 2 },
        { question: "What does 'He descended into hell' refer to?", options: ["Jesus experienced the full reality of death", "Jesus went to torture demons", "Jesus preached in hell", "It means He was buried"], correctAnswer: 0, order: 3 },
        { question: "What did Jesus defeat through His resurrection?", options: ["Death and sin", "The Romans", "The Pharisees", "Nature"], correctAnswer: 0, order: 4 },
      ]},
      { title: "I Believe in the Holy Spirit", description: "The third article: the Holy Spirit, Church, and life everlasting.", youtubeId: "dLFCE8z__hw", order: 2, questions: [
        { question: "What is the role of the Holy Spirit in the Creed?", options: ["To give life and sanctify the Church", "To replace Jesus", "To judge the world", "To inspire prophets only"], correctAnswer: 0, order: 0 },
        { question: "What does 'the holy catholic Church' mean?", options: ["The universal Church of all believers", "The Roman Catholic Church only", "A building", "The clergy"], correctAnswer: 0, order: 1 },
        { question: "What is 'the communion of saints'?", options: ["The fellowship of all believers in Christ", "A gathering of perfect people", "Only deceased saints", "Church leaders"], correctAnswer: 0, order: 2 },
        { question: "What does 'the forgiveness of sins' refer to?", options: ["God's grace through Christ's atonement", "Earning forgiveness through good works", "Forgetting our sins", "Denying sin exists"], correctAnswer: 0, order: 3 },
        { question: "What is 'the resurrection of the body'?", options: ["Believers will be raised physically", "Only the soul lives on", "Reincarnation", "Spiritual only"], correctAnswer: 0, order: 4 },
      ]},
    ],
  },
  {
    title: "Building Your Theology",
    slug: "building-your-theology",
    level: "advanced",
    description: "Learn how to build a solid, biblical theology — understanding revelation, authority, and interpretation. | Adapted from ThirdMill.org",
    creditText: "Content adapted from ThirdMill.org. Used with permission. Original material available at thirdmill.org.",
    order: 4,
    lessons: [
      { title: "What Is Theology?", description: "Defining theology and its importance for Christian life.", youtubeId: "7_CGP-12AE0", order: 0, questions: [
        { question: "What is theology?", options: ["The study of God and His relationship to creation", "The study of religion", "The study of the Bible only", "The study of church history"], correctAnswer: 0, order: 0 },
        { question: "Why is theology important?", options: ["It shapes how we understand God and live for Him", "It is only for pastors", "It is optional for Christians", "It replaces faith"], correctAnswer: 0, order: 1 },
        { question: "What is the primary source for Christian theology?", options: ["The Bible (Scripture)", "Tradition", "Reason", "Experience"], correctAnswer: 0, order: 2 },
        { question: "What does 'sola Scriptura' mean?", options: ["Scripture alone is the ultimate authority", "Tradition is equal to Scripture", "The Church interprets Scripture", "Scripture is outdated"], correctAnswer: 0, order: 3 },
        { question: "What role does reason play in theology?", options: ["A servant to Scripture, not master", "It replaces Scripture", "It is irrelevant", "It is the highest authority"], correctAnswer: 0, order: 4 },
      ]},
      { title: "General and Special Revelation", description: "How God reveals Himself through creation and Scripture.", youtubeId: "oUXJ8Owes8E", order: 1, questions: [
        { question: "What is general revelation?", options: ["God's revelation through nature and conscience", "The Bible", "Jesus Christ", "Prophecy"], correctAnswer: 0, order: 0 },
        { question: "What is special revelation?", options: ["God's specific revelation through Scripture and Christ", "Dreams and visions only", "Creation", "Human wisdom"], correctAnswer: 0, order: 1 },
        { question: "What does Psalm 19 say about general revelation?", options: ["The heavens declare the glory of God", "There is no God", "Nature is God", "Only believers see God in nature"], correctAnswer: 0, order: 2 },
        { question: "What is the clearest form of special revelation?", options: ["Jesus Christ — the Word incarnate", "The Bible", "Prophets", "Angels"], correctAnswer: 0, order: 3 },
        { question: "Can general revelation save someone?", options: ["No, it shows God's existence but not the gospel", "Yes, if they respond to nature", "Yes, through conscience", "Only for some people"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Authority and Interpretation", description: "Understanding biblical authority and how to interpret Scripture faithfully.", youtubeId: "ak06MSETeo4", order: 2, questions: [
        { question: "What is the ultimate authority for Christians?", options: ["God as revealed in Scripture", "The Church", "The pastor", "Personal experience"], correctAnswer: 0, order: 0 },
        { question: "What is a creed?", options: ["A concise statement of Christian faith", "A prayer", "A hymn", "A sermon"], correctAnswer: 0, order: 1 },
        { question: "Why were creeds developed?", options: ["To guard against false teaching", "To replace Scripture", "To please the government", "To create divisions"], correctAnswer: 0, order: 2 },
        { question: "What is the role of the church in interpretation?", options: ["The church community helps guard faithful interpretation", "The church alone determines meaning", "Each person interprets in isolation", "Only pastors can interpret"], correctAnswer: 0, order: 3 },
        { question: "What should guide our interpretation of difficult passages?", options: ["Clear passages should interpret unclear ones", "Our personal opinion", "What is most popular", "The oldest interpretation"], correctAnswer: 0, order: 4 },
      ]},
    ],
  },
  {
    title: "The Pentateuch",
    slug: "pentateuch",
    level: "advanced",
    description: "An in-depth study of the first five books of the Bible — Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. | Adapted from ThirdMill.org",
    creditText: "Content adapted from ThirdMill.org. Used with permission. Original material available at thirdmill.org.",
    order: 5,
    lessons: [
      { title: "Introduction to the Pentateuch", description: "Overview of the five books of Moses and their significance.", youtubeId: "GQI72THyO5I", order: 0, questions: [
        { question: "What does 'Pentateuch' mean?", options: ["Five scrolls", "Five books", "The Law", "The five-fold"], correctAnswer: 0, order: 0 },
        { question: "Who traditionally wrote the Pentateuch?", options: ["Moses", "Abraham", "Joshua", "David"], correctAnswer: 0, order: 1 },
        { question: "What are the five books of the Pentateuch?", options: ["Genesis, Exodus, Leviticus, Numbers, Deuteronomy", "Genesis, Exodus, Joshua, Judges, Ruth", "Genesis, Psalms, Proverbs, Isaiah, Jeremiah", "Genesis, Leviticus, Job, Psalms, Deuteronomy"], correctAnswer: 0, order: 2 },
        { question: "What is the Hebrew name for the Pentateuch?", options: ["Torah", "Nevi'im", "Ketuvim", "Tanakh"], correctAnswer: 0, order: 3 },
        { question: "What is the main theme of the Pentateuch?", options: ["God's covenant with His people", "The conquest of Canaan", "The monarchy of Israel", "The exile"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Exodus and Covenant", description: "The exodus from Egypt and the establishment of the covenant at Sinai.", youtubeId: "F4isSyennFo", order: 1, questions: [
        { question: "What does Exodus mean?", options: ["Departure or exit", "Arrival", "Journey", "Promise"], correctAnswer: 0, order: 0 },
        { question: "Who led the Israelites out of Egypt?", options: ["Moses and Aaron", "Joshua and Caleb", "Abraham and Isaac", "David and Solomon"], correctAnswer: 0, order: 1 },
        { question: "How many plagues struck Egypt?", options: ["10", "7", "12", "5"], correctAnswer: 0, order: 2 },
        { question: "What did God give at Mount Sinai?", options: ["The Ten Commandments and the Law", "The Promised Land", "A king", "Wealth"], correctAnswer: 0, order: 3 },
        { question: "What was the purpose of the Tabernacle?", options: ["A dwelling place for God among His people", "A military fortress", "A palace for Moses", "A marketplace"], correctAnswer: 0, order: 4 },
      ]},
      { title: "Leviticus, Numbers, and Deuteronomy", description: "Holiness, wilderness wandering, and the renewal of the covenant.", youtubeId: "XIb_dCIxzr0", order: 2, questions: [
        { question: "What is the main theme of Leviticus?", options: ["Holiness and proper worship", "Wandering in the wilderness", "Conquest of Canaan", "Leadership succession"], correctAnswer: 0, order: 0 },
        { question: "What is the main event in Numbers?", options: ["The wilderness wandering and census", "The giving of the Law", "The creation account", "The conquest of Jericho"], correctAnswer: 0, order: 1 },
        { question: "What does Deuteronomy mean?", options: ["Second Law or repetition of the Law", "First Law", "New Law", "Complete Law"], correctAnswer: 0, order: 2 },
        { question: "Who delivered the speeches in Deuteronomy?", options: ["Moses", "Joshua", "Aaron", "God directly"], correctAnswer: 0, order: 3 },
        { question: "What is the great commandment in Deuteronomy 6?", options: ["Love the Lord your God with all your heart", "Do not kill", "Keep the Sabbath", "Honor your parents"], correctAnswer: 0, order: 4 },
      ]},
    ],
  },
];

const ALL_SHOWS = [
  { title: "Debate", slug: "debate", category: "Talk Show", playlistId: "PLC0Rch0KTiEL1XcXiXO76FeMysmOQda-v", thumbnail: "/images/programs/debate.webp", description: "Christian apologetics and theological debates with scholars and experts." },
  { title: "Connection", slug: "connection", category: "Talk Show", playlistId: "PLC0Rch0KTiEL-7g_5Zt4nmcj1tKUMVlDJ", thumbnail: "/images/programs/connection.webp", description: "A youth program connecting faith with everyday life." },
  { title: "295C", slug: "295c", category: "Social Issues", playlistId: "PLC0Rch0KTiEJty_pIPyX862w551dRhSPC", thumbnail: "/images/programs/295c.webp", description: "Discussing Pakistan's blasphemy laws and their impact." },
  { title: "Meri Aawaz Suno", slug: "meri-aawaz-suno", category: "Talk Show", playlistId: "PLC0Rch0KTiEL3jSy9_haZ0IwwVnEOM502", thumbnail: "/images/programs/meri-awaz-suno.webp", description: "Giving voice to the voiceless." },
  { title: "Bol K Lab Azad Hain Tere", slug: "bol-k-lab-azad-hain-tere", category: "Talk Show", playlistId: "PLC0Rch0KTiEJJU9cHbZ_aZHkQuQKtG353", thumbnail: "/images/programs/bol-k-lub-azad-hai-tere.webp", description: "Speak freely — exploring women's roles in the Bible and society." },
  { title: "Ora et Labora", slug: "ora-et-labora", category: "Documentary", playlistId: "PLC0Rch0KTiEK78XGqgSzTgYovHc6M6l3M", thumbnail: "/images/programs/ora-et-labora.webp", description: "Pray and Work — documentary series featuring Christian businesses." },
  { title: "Masihi Zindagi", slug: "masihi-zindagi", category: "Devotional", playlistId: "PLC0Rch0KTiEK2HGhHh6ju0UAbR4GPpv_h", thumbnail: "https://i.ytimg.com/vi/pX1ngNLVn30/hqdefault.jpg", description: "Christian Life — practical teachings on living a faith-filled life." },
  { title: "Yesu Sang Sawera | Pastor Munawar Virk", slug: "yesu-sang-sawera-pastor-munawar-virk", category: "Devotional", playlistId: "PLC0Rch0KTiEJ5atmrt0aNyTJTbBRk8Dtd", thumbnail: "/images/programs/yesu-sang-sawera-pastor-munawar-virk.webp", description: "Morning with Jesus — daily devotional with Pastor Munawar Virk." },
  { title: "Yesu Sang Sawera | Pastor Imran Gill", slug: "yesu-sang-sawera-pastor-imran-gill", category: "Devotional", playlistId: "PLC0Rch0KTiEK59AdKYUxvjD4FYGGAk-3W", thumbnail: "/images/programs/yesu-sang-sawera-pastor-imran-gill.webp", description: "Morning with Jesus — daily devotional with Pastor Imran Gill." },
  { title: "Yesu Sang Sawera | Predikant Imko Postma", slug: "yesu-sang-sawera-predikant-imko-postma", category: "Devotional", playlistId: "PLC0Rch0KTiEJjSOc-b5azFbgnCgy27PFx", thumbnail: "/images/programs/ochtend-met-jezus-predikant-imko-postma.webp", description: "Morning with Jesus — devotional with Predikant Imko Postma." },
  { title: "Yesu Sang Sawera | Pastor Sarfaraz Rehmat", slug: "yesu-sang-sawera-pastor-sarfaraz-rehmat", category: "Devotional", playlistId: "PLC0Rch0KTiEJIkPavJjvPDX1eslj5q2Mt", thumbnail: "/images/programs/yesu-sang-sawera-pastor-sarfaraz-rehmat.webp", description: "Morning with Jesus — daily devotional with Pastor Sarfaraz Rehmat." },
  { title: "Morning With Jesus | Pastor Robert Slack", slug: "morning-with-jesus-pastor-robert-slack", category: "Devotional", playlistId: "PLC0Rch0KTiEIR35NdZTLISgKRMlc3BVw3", thumbnail: "/images/programs/morning-with-jesus-pastor-robert-slack.webp", description: "Morning devotional with Pastor Robert Slack." },
  { title: "Yesu Sang Sawera | Pastor Parvaiz Iqbal", slug: "yesu-sang-sawera-pastor-parvaiz-iqbal", category: "Devotional", playlistId: "PLC0Rch0KTiEI_mnwHqbtFVWkoBepRVJYz", thumbnail: "/images/programs/yesu-sang-sawera-pastor-parvaiz-iqbal.webp", description: "Morning with Jesus — devotional with Pastor Parvaiz Iqbal." },
  { title: "Yesu Sang Sawera | Bishop Emmanuel Aftab", slug: "yesu-sang-sawera-bishop-emmanuel-aftab", category: "Devotional", playlistId: "PLC0Rch0KTiEIM81Nxga6kBzrWTI4zKW6B", thumbnail: "/images/programs/yesu-sang-sawera-bishop-emmanuel-aftab.webp", description: "Morning with Jesus — daily devotional with Bishop Emmanuel Aftab." },
  { title: "Puray Dil Se", slug: "puray-dil-se", category: "Devotional", playlistId: "PLC0Rch0KTiEJmdYO0rgoAyxHvufDMRqey", thumbnail: "/images/programs/puray-dil-se.webp", description: "With All Your Heart — heartfelt worship and devotional program." },
  { title: "Tehqeeq-E-Bible", slug: "tehqeeqebible", category: "Devotional", playlistId: "PLC0Rch0KTiEJf5LpXqJUB7BOPTIxxYE4Y", thumbnail: "https://i.ytimg.com/vi/-vE4aOXdFU8/hqdefault.jpg", description: "Bible Research — in-depth study and investigation of biblical texts." },
  { title: "Farman-e-Masih", slug: "farmanemasih", category: "Devotional", playlistId: "PLC0Rch0KTiEJTLA68BSOZiawjHha_STu6", thumbnail: "/images/programs/farman-e-masih.webp", description: "Commandment of Christ — teachings from the words of Jesus." },
  { title: "Azmat-E-Masih", slug: "azmatemasih", category: "Devotional", playlistId: "PLC0Rch0KTiEKieg3BaUFw9Awo951JERSq", thumbnail: "https://i.ytimg.com/vi/C4Q5lYDdKZg/hqdefault.jpg", description: "Glory of Christ — exploring the majesty and divinity of Jesus Christ." },
  { title: "Choti Si Baat", slug: "choti-si-baat", category: "Talk Show", playlistId: "PLC0Rch0KTiELEXZy_VRdLOII3zDpXYh-m", thumbnail: "/images/programs/choti-si-baat.webp", description: "A Small Matter — conversations about everyday faith and life." },
  { title: "Aao Hamad Karin", slug: "aao-hamad-karin", category: "Devotional", playlistId: "PLC0Rch0KTiEJD0sPwhLDZKTexs0RhHtTk", thumbnail: "https://i.ytimg.com/vi/9JdEOSZFiLs/hqdefault.jpg", description: "Come Let's Praise — worship and praise program." },
  { title: "Yesu Sang Sawera | Pastor Nadeem K Dean", slug: "yesu-sang-sawera-pastor-nadeem-k-dean", category: "Devotional", playlistId: "PLC0Rch0KTiEJzzhjty0HYs02WBzM4Y7G1", thumbnail: "/images/programs/yesu-sang-sawera-pastor-nadeem-k-dean.webp", description: "Morning with Jesus — daily devotional with Pastor Nadeem K Dean." },
  { title: "Daagh", slug: "daagh", category: "Drama", playlistId: "PLC0Rch0KTiEJzd_BEgTrtW25He9bc5ykP", thumbnail: "/images/programs/daag.webp", description: "Stain — drama addressing forced conversions and social injustice." },
  { title: "Meri Kahani", slug: "meri-kahani", category: "Drama", playlistId: "PLC0Rch0KTiEJviSmXh9ffFJ57rLQcS84A", thumbnail: "https://i.ytimg.com/vi/_URLEq-amhM/hqdefault.jpg", description: "My Story — true testimonies of Muslim converts to Christianity." },
  { title: "Bandhan", slug: "bandhan", category: "Drama", playlistId: "PLC0Rch0KTiEKhqfRdSq7N9syvs31FNUQU", thumbnail: "/images/programs/bandhan.webp", description: "Bond — dramatic series exploring relationships and faith." },
  { title: "Aap Ki Sehat", slug: "aap-ki-sehat", category: "Health", playlistId: "PLC0Rch0KTiEIez3wRZiuJ3uIAVeqO8UAk", thumbnail: "/images/programs/aap-ki-sehat.webp", description: "Your Health — health awareness program." },
  { title: "Return Ticket", slug: "return-ticket", category: "Drama", playlistId: "PLC0Rch0KTiEJappsAzGuHckX-6Tnv3e0C", thumbnail: "/images/programs/return-ticket.webp", description: "Drama exploring the journey of life." },
  { title: "Aao Chalein", slug: "aao-chalein", category: "Documentary", playlistId: "PLC0Rch0KTiEIXhIrONRD0BUJOfT02hwOZ", thumbnail: "/images/programs/aao-chalein.webp", description: "Let's Go — documentary on social issues, human rights, and community events." },
  { title: "Safar-e-Shanakhat", slug: "safareshanakhat", category: "Documentary", playlistId: "PLC0Rch0KTiELmNtPpNsAFdD5R0DuHsc57", thumbnail: "/images/programs/safar-e-shanakht.webp", description: "Journey of Identity — documentary exploring Christian identity and heritage." },
  { title: "Career Guide", slug: "career-guide", category: "Education", playlistId: "PLC0Rch0KTiEKFnSQS_7_yzCXlBVE14c9K", thumbnail: "/images/programs/career-guide.webp", description: "Career guidance and professional development for youth." },
  { title: "Hamare Sitare", slug: "hamare-sitare", category: "Talk Show", playlistId: "PLC0Rch0KTiELF-r1NYnvutDhWwFA_PuWb", thumbnail: "/images/programs/hamarey-sitarey.webp", description: "Our Stars — interviews with prominent Christian leaders." },
  { title: "Pakistan Hamara Bhi Hai", slug: "pakistan-hamara-bhi-hai", category: "Social Issues", playlistId: "PLC0Rch0KTiEL62fRR7QFYnybfId__kUGp", thumbnail: "/images/programs/pakistan-hamara-bhi-hai.webp", description: "Pakistan Is Ours Too — advocating for minority rights." },
  { title: "BTL TV News & Updates", slug: "btl-tv-news-updates", category: "News", playlistId: "PLC0Rch0KTiEJ5r54n700_prgbhdZExCJG", thumbnail: "/images/programs/news.webp", description: "Official updates and news from Be The Light Television." },
  { title: "Yesu Sang Sawera | Pastor William Paighani", slug: "yesu-sang-sawera-pastor-william-paighani", category: "Devotional", playlistId: "PLC0Rch0KTiEJU6V0fg9XydpOjM8Yp0eAY", thumbnail: "https://i.ytimg.com/vi/yl1M9TTo0TM/hqdefault.jpg", description: "Morning with Jesus — daily devotional with Pastor William Paighani." },
  { title: "Prophecies About Jesus Christ", slug: "prophecies-about-jesus-christ", category: "Kids", playlistId: "PLC0Rch0KTiEINBNsxKVWV5gXlu8EmlWV0", thumbnail: "https://i.ytimg.com/vi/M_efw5g34gs/hqdefault.jpg", description: "Biblical prophecies about Jesus Christ for children." },
  { title: "Kids Stories", slug: "kids-stories", category: "Kids", playlistId: "PLC0Rch0KTiEJ4Ys17Q2GyDerDxuUkhe2z", thumbnail: "https://i.ytimg.com/vi/3v5dYvZweHg/hqdefault.jpg", description: "Bible stories told in a fun way for kids." },
  { title: "BTL Drama Specials", slug: "btl-drama-specials", category: "Drama", playlistId: "PLC0Rch0KTiEIub8WrDOvvwOfy2VMA8wV2", thumbnail: "https://i.ytimg.com/vi/KF9HGJn_mno/hqdefault.jpg", description: "Special drama productions from BTL TV." },
  { title: "Food for Your Heart", slug: "food-for-your-heart", category: "Devotional", playlistId: "PLC0Rch0KTiEKswX3Uhy-Rbc_v8oZGWoaN", thumbnail: "https://i.ytimg.com/vi/Ul0WTSmDN2M/hqdefault.jpg", description: "Spiritual nourishment for your soul." },
  { title: "Ochtend met Jezus | Predikant Douwe Wijmenga", slug: "ochtend-met-jezus-predikant-douwe-wijmenga", category: "Devotional", playlistId: "PLC0Rch0KTiEJHTsKT-ccjvRsQ7wq0zhNA", thumbnail: "/images/programs/morning-with-jesus-predikant-douwe-wijmenga.webp", description: "Morning devotionals in Dutch with Predikant Douwe Wijmenga." },
  { title: "Ochtend met Jezus | Predikant Terpstra", slug: "ochtend-met-jezus-predikant-terpstra", category: "Devotional", playlistId: "PLC0Rch0KTiEKa9nRM45q3IjtjnEcxx8Oq", thumbnail: "/images/programs/ochtend-met-jezus-pastor-terpstra.webp", description: "Morning devotionals in Dutch with Predikant Terpstra." },
  { title: "Urdu Bible", slug: "urdu-bible", category: "Devotional", playlistId: "PLC0Rch0KTiEIXuKgpvm7mq4YlLQ__HssQ", thumbnail: "https://i.ytimg.com/vi/6bjIhLSE504/hqdefault.jpg", description: "Complete Urdu Bible audio readings." },
];

const TEAM_MEMBERS = [
  { name: "Gasper Daniel", designation: "CEO & Founder", photo: "/images/team/gasper-daniel-ceo.png", displayOrder: 0 },
  { name: "Sumble Noreen", designation: "Vice President", photo: "/images/team/sumble-noreen-vp.png", displayOrder: 1 },
  { name: "Sahir Alam", designation: "Head of Audio & Video", photo: "/images/team/sahir-alam.webp", displayOrder: 2 },
  { name: "Karal Yohana", designation: "Head of Department", photo: "/images/team/karal-yohana-hod.png", displayOrder: 3 },
  { name: "Nayyar Noel", designation: "Co-Ordinator", photo: "/images/team/nayyar-noel.webp", displayOrder: 4 },
  { name: "Khisal Daniel", designation: "Director of Photography", photo: "/images/team/khisal-daniel-dop.png", displayOrder: 5 },
  { name: "Minahil Daniel", designation: "Director of Photography", photo: "/images/team/minahil-daniel-dop.png", displayOrder: 6 },
  { name: "Watson Gill", designation: "Host", photo: "/images/team/watson-gill.webp", displayOrder: 7 },
  { name: "Emmanuel Aftab", designation: "Bishop", photo: "/images/team/emmanuel-aftab.webp", displayOrder: 8 },
  { name: "Douwe Wijmenga", designation: "Predikant", photo: "/images/team/douwe-wijmenga.webp", displayOrder: 9 },
  { name: "Imko Postma", designation: "Predikant", photo: "/images/team/imko-postma.webp", displayOrder: 10 },
  { name: "Imran Gill", designation: "Pastor", photo: "/images/team/imran-gill.webp", displayOrder: 11 },
  { name: "Munawar Virk", designation: "Pastor", photo: "/images/team/munawar-virk.webp", displayOrder: 12 },
  { name: "Nadeem K Dean", designation: "Pastor", photo: "/images/team/nadeem-k-dean.webp", displayOrder: 13 },
  { name: "Parvaiz Iqbal", designation: "Pastor", photo: "/images/team/parvaiz-iqbal.webp", displayOrder: 14 },
  { name: "Robert Slack", designation: "Pastor", photo: "/images/team/robert-slack.webp", displayOrder: 15 },
  { name: "Sarfraz Rehmat", designation: "Pastor", photo: "/images/team/sarfraz-rehmat.webp", displayOrder: 16 },
  { name: "William Paighani", designation: "Pastor", photo: "/images/team/william-paighani.webp", displayOrder: 17 },
  { name: "Lazar Allah Rakha", designation: "Advocate", photo: "/images/team/lazar-allah-rakha.webp", displayOrder: 18 },
  { name: "Sooba Bhatti", designation: "Advocate", photo: "/images/team/sooba-bhatti.webp", displayOrder: 19 },
  { name: "Malook Israel", designation: "News Reporter", photo: "/images/team/malook-israel.webp", displayOrder: 20 },
];

const REVIEWS = [
  { name: "Saira Khan", rating: 5, comment: "BTL TV is a blessing for Urdu-speaking Christians. The programs are inspiring and the live TV feature is amazing! Finally a channel that speaks to our community.", source: "google", isApproved: true },
  { name: "John Masih", rating: 5, comment: "I watch Yesu Sang Sawera every morning. It has transformed my daily devotional life. May God continue to bless this ministry.", source: "google", isApproved: true },
  { name: "Maryam Bhatti", rating: 5, comment: "The Urdu Audio Bible on this platform is incredible. I can listen to God's word in my mother tongue anytime. Highly recommended!", source: "google", isApproved: true },
  { name: "David Gill", rating: 4, comment: "Great content for the Pakistani Christian community. The dramas are particularly well-produced. Would love to see more kids programs.", source: "google", isApproved: true },
  { name: "Ruth Parvez", rating: 5, comment: "This ministry is doing amazing work. The talk shows address real issues faced by Christians in Pakistan. BTL TV is a voice for the voiceless.", source: "google", isApproved: true },
  { name: "Tariq Alexander", rating: 5, comment: "I downloaded the APK and the app works perfectly. Being able to watch Christian content in Urdu on my phone is wonderful. God bless BTL TV!", source: "google", isApproved: true },
  { name: "Nazia Daniel", rating: 4, comment: "The programs are very informative and spiritually uplifting. The quality of production keeps improving. Keep up the great work!", source: "google", isApproved: true },
  { name: "Samuel Yousaf", rating: 5, comment: "Finally a Christian television platform that truly understands the Urdu-speaking community. Every program is thoughtfully created. Highly blessed!", source: "google", isApproved: true },
  { name: "Peter Masih", rating: 5, comment: "I watch BTL TV daily with my family. The kids programs are wonderful and my children love the Bible stories. May God bless this ministry abundantly.", source: "google", isApproved: true },
  { name: "Asha Yousaf", rating: 5, comment: "The Urdu Audio Bible is a treasure. I listen to it during my commute and it has strengthened my faith tremendously. Thank you BTL TV!", source: "google", isApproved: true },
  { name: "Bashir Bhatti", rating: 4, comment: "Quality Christian content in Urdu is rare. BTL TV is filling a huge gap. The talk shows are thought-provoking and well-produced.", source: "google", isApproved: true },
  { name: "Nasreen Gill", rating: 5, comment: "I love the morning devotional Yesu Sang Sawera. It starts my day with peace and hope. The pastors speak directly to my heart.", source: "google", isApproved: true },
  { name: "Shazia Parvez", rating: 4, comment: "The dramas on BTL TV are very impactful. They address real social issues that we face in our communities. Keep producing such meaningful content.", source: "google", isApproved: true },
  { name: "Imran Sagar", rating: 5, comment: "Best Christian television platform for Urdu speakers. The app works smoothly and the streaming quality is excellent. Highly recommended!", source: "google", isApproved: true },
  { name: "Rubina Kausar", rating: 5, comment: "BTL TV has become a part of our family's daily routine. My mother especially enjoys the worship programs. God bless the entire team.", source: "google", isApproved: true },
  { name: "Albert David", rating: 4, comment: "The documentaries on Christian history and identity are very educational. I've learned so much about our heritage through BTL TV.", source: "google", isApproved: true },
  { name: "Farzana James", rating: 5, comment: "Finally a channel that represents Pakistani Christians with dignity and respect. The programs are professional and spiritually enriching.", source: "google", isApproved: true },
  { name: "Khalid Emmanuel", rating: 5, comment: "I am a pastor and I recommend BTL TV to my entire congregation. The Bible teaching programs are doctrinally sound and very helpful.", source: "google", isApproved: true },
  { name: "Shama Noreen", rating: 4, comment: "The women's programs are particularly inspiring. They address issues that matter to us and give us a platform to be heard. Great work!", source: "google", isApproved: true },
  { name: "Yousef William", rating: 5, comment: "I live abroad and BTL TV connects me to my community back home. The Urdu content makes me feel close to my roots. A wonderful ministry.", source: "google", isApproved: true },
  { name: "Tabassum Saleem", rating: 5, comment: "The live TV feature is excellent. I can watch BTL TV anywhere in the world. The satellite broadcast reaches even remote areas. Amazing!", source: "google", isApproved: true },
  { name: "Sohail Asghar", rating: 4, comment: "Good variety of programs — from talk shows to dramas to devotionals. The production quality keeps getting better with each passing year.", source: "google", isApproved: true },
  { name: "Anita Younas", rating: 5, comment: "BTL TV gives hope to the Christian community in Pakistan. The programs address our struggles and celebrate our faith. Truly a blessing!", source: "google", isApproved: true },
];

export async function GET() { return POST(); }

export async function POST() {
  try {
    let msg = "";
    const { hash } = await import("bcryptjs");
    const passwordHash = await hash("BTL@2026Admin!", 12);
    await prisma.user.upsert({
      where: { email: "bethelighttelevision@gmail.com" },
      update: { passwordHash, name: "Admin" },
      create: { name: "Admin", email: "bethelighttelevision@gmail.com", passwordHash },
    });
    msg += "Admin account ready. ";

    for (let i = 0; i < ALL_SHOWS.length; i++) {
      const s = ALL_SHOWS[i];
      await prisma.show.upsert({
        where: { slug: s.slug },
        update: { ...s, order: i, isActive: true },
        create: { ...s, order: i },
      });
    }
    msg += `${ALL_SHOWS.length} shows seeded. `;

    const existingMembers = await prisma.teamMember.count();
    if (existingMembers === 0) {
      for (const m of TEAM_MEMBERS) {
        await prisma.teamMember.create({ data: m });
      }
      msg += `${TEAM_MEMBERS.length} team members seeded.`;
    } else {
      msg += `Team members already exist (${existingMembers}).`;
    }

    for (const r of REVIEWS) {
      await prisma.review.create({ data: r });
    }
    msg += `${REVIEWS.length} reviews seeded. `;

    await prisma.setting.upsert({
      where: { key: "googleReviewUrl" },
      update: { value: "https://g.page/r/CS8tSbX-fni-EBM/review" },
      create: { key: "googleReviewUrl", value: "https://g.page/r/CS8tSbX-fni-EBM/review" },
    });
    msg += "Google review URL set. ";

    let courseCount = 0;
    for (const c of BIBLE_COURSES) {
      const { lessons, ...courseData } = c;
      const existing = await prisma.course.findUnique({ where: { slug: c.slug } });
      let course;
      if (existing) {
        course = existing;
        await prisma.course.update({ where: { slug: c.slug }, data: { isPublished: true } });
        await prisma.quizQuestion.deleteMany({ where: { lesson: { courseId: course.id } } });
        await prisma.lesson.deleteMany({ where: { courseId: course.id } });
      } else {
        course = await prisma.course.create({ data: { ...courseData, isPublished: true } });
      }
      for (const l of lessons) {
        const { questions, ...lessonData } = l;
        const lesson = await prisma.lesson.create({ data: { ...lessonData, courseId: course.id } });
        for (const q of questions) {
          await prisma.quizQuestion.create({ data: { ...q, options: JSON.stringify(q.options), lessonId: lesson.id } });
        }
      }
      courseCount++;
    }
    msg += `${courseCount} Bible courses seeded.`;

    return NextResponse.json({ message: msg });
  } catch (e) { return apiError(e); }
}
