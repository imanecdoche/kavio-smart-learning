/**
 * Data Penjelasan Lengkap Fungsi Utama Tenses & Contoh Otentik
 * Mencakup 16 Tenses Bahasa Inggris untuk Modal Panduan Grammar Playground
 */

export const TENSE_EXPLANATIONS = {
  PRESENT_SIMPLE: {
    id: 'PRESENT_SIMPLE',
    name: 'Simple Present Tense',
    tagline: 'Fakta abadi, kebiasaan rutin, dan kondisi permanen yang selalu berlaku.',
    mindset:
      'Penutur asli menggunakan Simple Present bukan untuk membicarakan apa yang sedang terjadi detik ini, melainkan apa yang secara umum benar, berulang sebagai rutinitas, atau menjadi sifat bawaan suatu hal tanpa batas waktu tertentu.',
    mainFunctions: [
      {
        title: 'Rutinitas & Kebiasaan Sehari-hari (Habitual Actions)',
        situation: 'Digunakan untuk aksi yang dilakukan berulang kali secara terjadwal atau rutin.',
        examples: [
          {
            en: 'I wake up at 5 AM every single day.',
            id: 'Saya bangun jam 5 pagi setiap hari.',
            context: 'Menyatakan jadwal tidur dan bangun rutin.',
          },
          {
            en: 'She drinks green tea after finishing her workout.',
            id: 'Dia minum teh hijau setelah menyelesaikan olahraganya.',
            context: 'Kebiasaan personal yang teratur.',
          },
        ],
      },
      {
        title: 'Kebenaran Umum & Hukum Alam (General Truths & Facts)',
        situation: 'Fakta ilmiah, fenomena alam, atau prinsip matematika yang tidak berubah.',
        examples: [
          {
            en: 'Water boils at 100 degrees Celsius.',
            id: 'Air mendidih pada suhu 100 derajat Celsius.',
            context: 'Hukum fisika yang abadi.',
          },
          {
            en: 'The sun rises in the east and sets in the west.',
            id: 'Matahari terbit di timur dan terbenam di barat.',
            context: 'Fakta alam semesta.',
          },
        ],
      },
      {
        title: 'Keadaan Permanen & Karakteristik (Permanent States)',
        situation: 'Menyatakan tempat tinggal, pekerjaan, status, atau sifat yang relatif menetap dalam jangka panjang.',
        examples: [
          {
            en: 'My parents live in Bandung, and my brother works at a hospital.',
            id: 'Orang tua saya tinggal di Bandung, dan saudara saya bekerja di rumah sakit.',
            context: 'Kondisi hidup jangka panjang.',
          },
        ],
      },
      {
        title: 'Jadwal Masa Depan yang Pasti (Fixed Timetables)',
        situation: 'Jadwal transportasi umum, jam tayang, atau agenda resmi yang sudah baku.',
        examples: [
          {
            en: 'The flight departs at 9:15 PM tonight.',
            id: 'Penerbangan itu berangkat pukul 9:15 malam ini.',
            context: 'Jadwal resmi pesawat.',
          },
        ],
      },
    ],
    timeSignals: ['every day', 'always', 'usually', 'often', 'sometimes', 'seldom', 'never', 'on weekends', 'once a month'],
    pitfalls: [
      'Tambahan akhiran -s atau -es HANYA berlaku untuk subjek orang ketiga tunggal (He, She, It) pada kalimat positif verbal.',
      'Dilarang mencampur to be (is/am/are) langsung dengan Verb 1 dasar (contoh salah: "He is study", yang benar: "He studies").',
      'Pada kalimat negatif dan tanya, kata kerja selalu kembali ke Verb 1 dasar karena sudah ada kata bantu do/does.',
    ],
  },

  PRESENT_CONTINUOUS: {
    id: 'PRESENT_CONTINUOUS',
    name: 'Present Continuous Tense',
    tagline: 'Aktivitas yang sedang berlangsung saat ini, situasi temporer, dan rencana pasti masa depan.',
    mindset:
      'Penutur asli menggunakan Continuous untuk memandang suatu aksi dari tengah-tengah prosesnya. Aksi tersebut telah dimulai dan belum selesai, sehingga terasa dinamis, aktif, atau bersifat sementara.',
    mainFunctions: [
      {
        title: 'Sedang Terjadi Saat Berbicara (In Progress Right Now)',
        situation: 'Aktivitas fisik atau peristiwa yang persis sedang berlangsung di detik ini.',
        examples: [
          {
            en: 'Please speak softly, the baby is sleeping in the next room.',
            id: 'Tolong bicara pelan-pelan, bayinya sedang tidur di kamar sebelah.',
            context: 'Peristiwa yang sedang berlangsung saat pembicara berbicara.',
          },
          {
            en: 'They are discussing the new strategy in the conference room.',
            id: 'Mereka sedang mendiskusikan strategi baru di ruang konferensi.',
            context: 'Rapat yang sedang berjalan saat ini.',
          },
        ],
      },
      {
        title: 'Situasi Sementara & Tren Terkini (Temporary Trends)',
        situation: 'Aktivitas yang sedang dijalani sekitar periode waktu sekarang, meski tidak harus persis di detik ini.',
        examples: [
          {
            en: 'I am taking an online data analytics course this semester.',
            id: 'Saya sedang mengambil kursus analitik data online semester ini.',
            context: 'Aktivitas sementara selama beberapa minggu/bulan.',
          },
          {
            en: 'More people are working from home these days.',
            id: 'Semakin banyak orang yang bekerja dari rumah akhir-akhir ini.',
            context: 'Perubahan gaya hidup atau tren.',
          },
        ],
      },
      {
        title: 'Rencana Masa Depan yang Terkonfirmasi (Definite Arrangements)',
        situation: 'Rencana masa depan yang sudah dipersiapkan secara matang (tiket sudah dibeli / janji temu sudah disepakati).',
        examples: [
          {
            en: 'We are meeting the marketing director tomorrow morning.',
            id: 'Kami akan menemui direktur pemasaran besok pagi.',
            context: 'Janji temu resmi yang sudah terjadwal pasti.',
          },
        ],
      },
      {
        title: 'Keluhan atas Kebiasaan Menjengkelkan (Annoyance with Always)',
        situation: 'Mengungkapkan rasa frustrasi atas kebiasaan seseorang yang terjadi terlalu sering di luar batas wajar.',
        examples: [
          {
            en: 'He is always forgetting his wallet whenever we go out.',
            id: 'Dia selalu saja melupakan dompetnya setiap kali kita pergi keluar.',
            context: 'Kritik atau kejengkelan atas kebiasaan buruk.',
          },
        ],
      },
    ],
    timeSignals: ['now', 'right now', 'at the moment', 'currently', 'at present', 'this week', 'these days', 'look!', 'listen!'],
    pitfalls: [
      'Jangan gunakan Stative Verbs (kata kerja rasa, pemikiran, atau kepemilikan seperti know, understand, believe, love, hate, want, have/memiliki) dalam bentuk continuous. Gunakan Simple Present (contoh salah: "I am knowing him", yang benar: "I know him").',
      'To be (am/is/are) wajib hadir sebelum Verb-ing. "I studying" adalah bentuk yang tidak baku.',
    ],
  },

  PRESENT_PERFECT: {
    id: 'PRESENT_PERFECT',
    name: 'Present Perfect Tense',
    tagline: 'Jembatan antara masa lalu dan masa kini: hasil, pengalaman hidup, dan aksi yang baru saja selesai.',
    mindset:
      'Penutur asli menggunakan Present Perfect ketika kapan waktu lampau terjadinya aksi TIDAK PENTING, melainkan dampaknya, status penyelesaiannya, atau relevansinya terhadap situasi sekarang adalah yang paling diutamakan.',
    mainFunctions: [
      {
        title: 'Aksi Lampau yang Hasilnya Relevan Sekarang (Present Result)',
        situation: 'Kejadian masa lalu yang secara langsung mengubah atau mempengaruhi keadaan saat ini.',
        examples: [
          {
            en: 'I have lost my key, so I cannot unlock the front door.',
            id: 'Saya telah kehilangan kunci saya, sehingga saya tidak bisa membuka pintu depan sekarang.',
            context: 'Dampak nyata dari aksi masa lalu dirasakan detik ini.',
          },
          {
            en: 'She has prepared the entire financial report.',
            id: 'Dia telah menyiapkan seluruh laporan keuangan itu.',
            context: 'Laporan sekarang sudah selesai dan siap digunakan.',
          },
        ],
      },
      {
        title: 'Pengalaman Hidup (Life Experience)',
        situation: 'Menanyakan atau menceritakan hal yang pernah/belum pernah dialami sepanjang hidup hingga saat ini.',
        examples: [
          {
            en: 'Have you ever tried traditional Japanese matcha?',
            id: 'Apakah kamu pernah mencoba matcha tradisional Jepang?',
            context: 'Pengalaman seumur hidup.',
          },
          {
            en: 'I have visited five different continents so far.',
            id: 'Saya sudah mengunjungi lima benua berbeda sejauh ini.',
            context: 'Pencapaian hidup hingga detik ini.',
          },
        ],
      },
      {
        title: 'Keadaan yang Masih Berlanjut (Unfinished Time with Since/For)',
        situation: 'Aksi atau keadaan yang dimulai di masa lalu dan masih terus berlangsung saat ini.',
        examples: [
          {
            en: 'They have lived in this neighborhood since 2015.',
            id: 'Mereka sudah tinggal di lingkungan ini sejak tahun 2015.',
            context: 'Tinggal dimulai tahun 2015 dan sampai hari ini masih tinggal di sini.',
          },
        ],
      },
      {
        title: 'Baru Saja Selesai (Recent Completion with Just/Already)',
        situation: 'Menyatakan berita terbaru atau aksi yang selesai beberapa saat yang lalu.',
        examples: [
          {
            en: 'The train has just arrived at Platform 3.',
            id: 'Kereta itu baru saja tiba di Peron 3.',
            context: 'Kejadian sangat baru berlangsung.',
          },
        ],
      },
    ],
    timeSignals: ['already', 'just', 'yet', 'ever', 'never', 'since', 'for', 'recently', 'lately', 'so far'],
    pitfalls: [
      'DILARANG menyebutkan waktu lampau spesifik seperti yesterday, last night, two years ago, in 2020 bersama Present Perfect. Jika waktu lampau disebutkan jelas, wajib beralih ke Simple Past (contoh salah: "I have seen him yesterday", yang benar: "I saw him yesterday").',
      'Bedakan "have gone to" (sudah pergi dan belum kembali) dengan "have been to" (pernah berkunjung dan sudah kembali).',
    ],
  },

  'PRESENT_PER.CONT': {
    id: 'PRESENT_PER.CONT',
    name: 'Present Perfect Continuous Tense',
    tagline: 'Menekankan proses, durasi yang panjang, dan keletihan dari aktivitas yang belum tuntas.',
    mindset:
      'Jika Present Perfect berfokus pada HASIL (apakah sudah selesai?), maka Present Perfect Continuous berfokus pada PROSES & KERINGAT (sudah berapa lama kamu berkutat melakukannya?).',
    mainFunctions: [
      {
        title: 'Penekanan Durasi yang Sedang Berjalan (Ongoing Duration)',
        situation: 'Menunjukkan seberapa lama suatu aktivitas telah menyita waktu hingga saat ini.',
        examples: [
          {
            en: 'It has been raining continuously for four hours.',
            id: 'Hujan sudah turun terus-menerus selama empat jam.',
            context: 'Menekankan panjangnya durasi hujan yang belum reda.',
          },
          {
            en: 'I have been studying English grammar since 7 AM.',
            id: 'Saya sudah belajar tata bahasa Inggris sejak jam 7 pagi.',
            context: 'Menunjukkan komitmen waktu yang intens.',
          },
        ],
      },
      {
        title: 'Aktivitas Baru Saja Berhenti dengan Bukti Fisik Nyata (Physical Evidence)',
        situation: 'Aktivitas mungkin baru saja berhenti beberapa menit lalu, namun bukti fisiknya terlihat jelas pada seseorang.',
        examples: [
          {
            en: 'Why are your hands dirty? I have been fixing my bicycle.',
            id: 'Mengapa tanganmu kotor? Saya tadi habis memperbaiki sepeda saya.',
            context: 'Bukti fisik tangan kotor menjelaskan aktivitas yang baru saja dilakukan.',
          },
          {
            en: 'She is out of breath because she has been running up the stairs.',
            id: 'Dia terengah-engah karena tadi habis berlari menaiki tangga.',
            context: 'Napas terengah-engah membuktikan aksi lari yang baru saja terjadi.',
          },
        ],
      },
    ],
    timeSignals: ['for [duration]', 'since [point in time]', 'all day', 'all morning', 'lately', 'how long...?'],
    pitfalls: [
      'Jangan gunakan bentuk ini untuk Stative Verbs (seperti have, know, belong). Katakan "I have known him for years", bukan "I have been knowing him".',
      'Pada kalimat nominal murni, bentuk "have been being" sah secara gramatikal tetapi sangat dihindari dalam percakapan nyata; penutur asli memilih "have been" biasa.',
    ],
  },

  PAST_SIMPLE: {
    id: 'PAST_SIMPLE',
    name: 'Simple Past Tense',
    tagline: 'Peristiwa yang selesai tuntas di masa lampau dan sudah tidak lagi terikat dengan masa kini.',
    mindset:
      'Penutur asli memandang Simple Past sebagai cerita sejarah yang kotaknya sudah ditutup rapat. Peristiwa itu selesai pada waktu tertentu di masa lalu, dan kita melihatnya sebagai fakta riwayat yang objektif.',
    mainFunctions: [
      {
        title: 'Aksi Tuntas di Waktu Lampau Tertentu (Completed Past Action)',
        situation: 'Aktivitas yang terjadi dan tuntas sepenuhnya pada titik waktu spesifik di masa lalu.',
        examples: [
          {
            en: 'We launched the new mobile application last month.',
            id: 'Kami meluncurkan aplikasi mobile baru itu bulan lalu.',
            context: 'Peristiwa peluncuran yang tuntas di masa lampau.',
          },
          {
            en: 'She graduated from university in 2022.',
            id: 'Dia lulus dari universitas pada tahun 2022.',
            context: 'Riwayat pencapaian masa lalu.',
          },
        ],
      },
      {
        title: 'Rangkaian Peristiwa Kronologis (Consecutive Narrative)',
        situation: 'Menceritakan urutan aksi masa lalu yang terjadi satu per satu secara berurutan dalam sebuah cerita.',
        examples: [
          {
            en: 'He unlocked the gate, stepped inside, and called out his friend’s name.',
            id: 'Dia membuka gerbang, melangkah masuk, dan memanggil nama temannya.',
            context: 'Kronologi urutan peristiwa dalam bercerita.',
          },
        ],
      },
      {
        title: 'Kebiasaan atau Keadaan Masa Lalu (Past Habit or State)',
        situation: 'Kebiasaan di masa kecil atau masa lampau yang saat ini sudah tidak lagi dilakukan.',
        examples: [
          {
            en: 'When I lived near the beach, I swam every morning.',
            id: 'Ketika saya tinggal di dekat pantai, saya berenang setiap pagi.',
            context: 'Kebiasaan lama yang sudah berakhir.',
          },
        ],
      },
    ],
    timeSignals: ['yesterday', 'last night', 'last week', 'two days ago', 'in 2018', 'just now', 'when I was young'],
    pitfalls: [
      'Verb 2 (kata kerja bentuk lampau) HANYA dipakai pada kalimat positif aktif. Pada kalimat negatif dan tanya, kata kerja WAJIB kembali ke Verb 1 dasar karena did sudah mengambil alih tanda lampau (contoh salah: "Did you saw him?", yang benar: "Did you see him?").',
      'Hati-hati dengan kata kerja tak beraturan (Irregular Verbs) seperti buy -> bought, go -> went, speak -> spoke.',
    ],
  },

  PAST_CONTINUOUS: {
    id: 'PAST_CONTINUOUS',
    name: 'Past Continuous Tense',
    tagline: 'Aksi yang sedang berlangsung pada momen spesifik di masa lampau, sering disela aksi lain.',
    mindset:
      'Bayangkan sebuah rekaman video masa lalu di mana aksi sedang bergulir di tengah jalan pada jam tertentu, atau menjadi latar belakang suasana (background scene) saat peristiwa lain mendadak terjadi.',
    mainFunctions: [
      {
        title: 'Sedang Berlangsung pada Jam Spesifik di Masa Lalu (Action in Progress)',
        situation: 'Menggambarkan apa yang persis sedang dilakukan seseorang pada jam tertentu kemarin.',
        examples: [
          {
            en: 'At 8:30 PM yesterday, I was watching a documentary about space.',
            id: 'Pukul 8:30 malam kemarin, saya sedang menonton film dokumenter tentang luar angkasa.',
            context: 'Menjelaskan aktivitas yang sedang berlangsung tepat pada jam itu.',
          },
        ],
      },
      {
        title: 'Aksi Sedang Berlangsung Disela Aksi Lain (Interrupted Action)',
        situation: 'Aksi berdurasi panjang (Past Continuous) yang dipotong oleh aksi mendadak berdurasi pendek (Simple Past).',
        examples: [
          {
            en: 'I was driving to work when the car suddenly broke down.',
            id: 'Saya sedang menyetir mobil menuju tempat kerja ketika tiba-tiba mobil mogok.',
            context: 'Menyetir adalah aksi yang sedang berjalan; mobil mogok adalah penyela mendadak.',
          },
        ],
      },
      {
        title: 'Dua Aksi Sedang Berlangsung Bersamaan (Simultaneous Actions)',
        situation: 'Dua orang melakukan aktivitas masing-masing pada waktu yang sama di masa lalu.',
        examples: [
          {
            en: 'While my sister was studying in her room, I was cooking dinner.',
            id: 'Saat saudara perempuan saya sedang belajar di kamarnya, saya sedang memasak makan malam.',
            context: 'Dua aksi paralel di masa lalu.',
          },
        ],
      },
    ],
    timeSignals: ['at that time', 'at 7 PM yesterday', 'when', 'while', 'as', 'all night long yesterday'],
    pitfalls: [
      'Gunakan was untuk I, He, She, It, dan benda tunggal. Gunakan were untuk You, We, They, dan benda jamak.',
      'Klausa yang diawali kata while biasanya diikuti Past Continuous (aksi berdurasi), sedangkan klausa dengan when umumnya diikuti Simple Past (aksi penyela).',
    ],
  },

  PAST_PERFECT: {
    id: 'PAST_PERFECT',
    name: 'Past Perfect Tense',
    tagline: 'Peristiwa yang telah selesai lebih awal sebelum peristiwa lampau lainnya terjadi.',
    mindset:
      'Penutur asli menyebut Past Perfect sebagai "The Earlier Past" (Masa Lalu yang Lebih Tua). Tense ini digunakan sebagai penunjuk urutan waktu kronologis ketika ada dua kejadian lampau, agar jelas peristiwa mana yang terjadi terlebih dahulu.',
    mainFunctions: [
      {
        title: 'Aksi Selesai Sebelum Aksi Lampau Lain Terjadi (The Earlier Past)',
        situation: 'Memastikan pendengar paham bahwa peristiwa A sudah tuntas sebelum peristiwa B menyusul.',
        examples: [
          {
            en: 'When we arrived at the cinema, the movie had already started.',
            id: 'Ketika kami tiba di bioskop, filmnya sudah mulai lebih dulu.',
            context: 'Film mulai terlebih dahulu, barulah kami tiba setelahnya.',
          },
          {
            en: 'She had finished her assignment before the teacher asked for it.',
            id: 'Dia sudah menyelesaikan tugasnya sebelum guru memintanya.',
            context: 'Penyelesaian tugas mendahului permintaan guru.',
          },
        ],
      },
      {
        title: 'Pengandaian Kondisional Tipe 3 (Hypothetical Past Regret)',
        situation: 'Menyatakan penyesalan atau situasi masa lalu yang andai saja terjadi berbeda.',
        examples: [
          {
            en: 'If I had studied harder, I would have passed the exam.',
            id: 'Seandainya saya belajar lebih giat saat itu, saya pasti sudah lulus ujian tersebut.',
            context: 'Penyesalan atas kenyataan masa lampau.',
          },
        ],
      },
    ],
    timeSignals: ['before', 'after', 'by the time', 'already', 'until that day', 'never... before'],
    pitfalls: [
      'Jangan gunakan Past Perfect sendirian tanpa ada pembanding kejadian lampau lainnya (Simple Past), kecuali konteks cerita sudah sangat jelas.',
      'Jika urutan waktu sudah sangat jelas melalui kata penghubung seperti before atau after, penutur asli sering menyederhanakannya ke Simple Past tanpa mengubah makna.',
    ],
  },

  'PAST_PER.CONT': {
    id: 'PAST_PER.CONT',
    name: 'Past Perfect Continuous Tense',
    tagline: 'Menunjukkan durasi panjang suatu aktivitas sebelum akhirnya terhenti oleh peristiwa lain di masa lampau.',
    mindset:
      'Tense ini menggabungkan masa lalu yang lebih tua dengan keletihan proses durasi. Tujuannya adalah memperlihatkan berapa lama seseorang sudah berjuang melakukan sesuatu sebelum momen tertentu di masa lalu.',
    mainFunctions: [
      {
        title: 'Durasi Berkelanjutan Sebelum Titik Lampau (Continuous Duration Before Past Event)',
        situation: 'Aktivitas yang telah berjalan cukup lama sebelum disela atau diakhiri oleh peristiwa masa lalu.',
        examples: [
          {
            en: 'They had been waiting for two hours before the bus finally arrived.',
            id: 'Mereka sudah menunggu selama dua jam sebelum bus akhirnya tiba.',
            context: 'Menekankan rasa lelah dari lamanya waktu menunggu di masa lalu.',
          },
        ],
      },
      {
        title: 'Penyebab dari Keadaan Nyata di Masa Lampau (Cause of a Past Result)',
        situation: 'Menjelaskan alasan di balik kondisi fisik seseorang atau sesuatu di masa lalu.',
        examples: [
          {
            en: 'The road was slippery because it had been raining all night.',
            id: 'Jalanan licin karena sebelumnya hujan sudah turun semalaman.',
            context: 'Hujan semalaman menjelaskan kenapa jalanan saat itu menjadi licin.',
          },
        ],
      },
    ],
    timeSignals: ['for [duration] before [event]', 'by the time', 'all that morning', 'since'],
    pitfalls: [
      'Bentuk rumus verbal: Subjek + had + been + Verb-ing.',
      'Sering digantikan dengan Past Continuous atau Past Perfect oleh penutur asli untuk mempersingkat ucapan kecuali jika durasi sangat ditekankan.',
    ],
  },

  FUTURE_SIMPLE: {
    id: 'FUTURE_SIMPLE',
    name: 'Simple Future Tense',
    tagline: 'Keputusan spontan, prediksi masa depan, janji, tawaran bantuan, dan penolakan.',
    mindset:
      'Penutur asli menggunakan will bukan untuk rencana yang sudah dibukukan jauh-jauh hari, melainkan untuk reaksi spontan di tempat saat berbicara, keyakinan pribadi atas masa depan, atau komitmen janji.',
    mainFunctions: [
      {
        title: 'Keputusan Spontan Saat Berbicara (Spontaneous Decision)',
        situation: 'Memutuskan sesuatu secara mendadak saat merespons keadaan di detik itu juga.',
        examples: [
          {
            en: 'Someone is knocking on the door. I will open it.',
            id: 'Seseorang sedang mengetuk pintu. Saya yang akan membukanya.',
            context: 'Keputusan spontan tanpa rencana sebelumnya.',
          },
          {
            en: 'You look tired. I will carry those heavy bags for you.',
            id: 'Kamu tampak lelah. Saya akan membawakan tas-tas berat itu untukmu.',
            context: 'Tawaran bantuan spontan.',
          },
        ],
      },
      {
        title: 'Prediksi Berdasarkan Pendapat atau Keyakinan (Opinion-based Prediction)',
        situation: 'Menebak apa yang akan terjadi di masa depan berdasarkan intuisi atau pemikiran pribadi.',
        examples: [
          {
            en: 'I think our team will win the championship this season.',
            id: 'Saya rasa tim kita akan memenangkan kejuaraan musim ini.',
            context: 'Prediksi subjektif berdasarkan opini.',
          },
        ],
      },
      {
        title: 'Janji dan Komitmen Tegas (Promises & Commitments)',
        situation: 'Menyatakan janji atau kepastian komitmen kepada orang lain.',
        examples: [
          {
            en: 'I will never forget your kindness.',
            id: 'Saya tidak akan pernah melupakan kebaikanmu.',
            context: 'Janji tulus masa depan.',
          },
          {
            en: 'He won’t tell anyone about our secret plan.',
            id: 'Dia tidak akan memberitahu siapa pun tentang rencana rahasia kita.',
            context: 'Jaminan komitmen negatif (won\'t).',
          },
        ],
      },
    ],
    timeSignals: ['tomorrow', 'tonight', 'next week', 'next year', 'soon', 'in two days', 'someday'],
    pitfalls: [
      'Untuk rencana yang sudah dipikirkan matang-matang atau tiketnya sudah dipesan, penutur asli lebih memilih be going to atau Present Continuous, bukan will.',
      'Setelah kata will, kata kerja SELALU kembali ke bentuk dasar Verb 1 murni (tanpa akhiran -s, -ed, atau to).',
    ],
  },

  FUTURE_CONTINUOUS: {
    id: 'FUTURE_CONTINUOUS',
    name: 'Future Continuous Tense',
    tagline: 'Aksi yang dipastikan akan sedang berlangsung pada jam tertentu di masa depan.',
    mindset:
      'Bayangkan diri Anda melompati waktu ke masa depan pada jam tertentu besok: Anda tidak melihat awal atau akhirnya, melainkan membayangkan diri Anda sedang sibuk di tengah-tengah aktivitas tersebut.',
    mainFunctions: [
      {
        title: 'Sedang Berlangsung pada Waktu Tertentu di Masa Depan (Action in Progress at Specific Future Time)',
        situation: 'Menyatakan bahwa pada jam atau momen tertentu di masa depan, aksi tersebut sedang bergulir.',
        examples: [
          {
            en: 'This time tomorrow, I will be flying over the Pacific Ocean.',
            id: 'Pada jam seperti ini besok, saya akan sedang terbang di atas Samudra Pasifik.',
            context: 'Membayangkan diri sedang berada di pesawat besok.',
          },
          {
            en: 'Don’t call him at 3 PM; he will be presenting the quarterly report.',
            id: 'Jangan telepon dia jam 3 sore; dia akan sedang mempresentasikan laporan triwulan.',
            context: 'Aktivitas yang dipastikan sedang berjalan pada jam tersebut.',
          },
        ],
      },
      {
        title: 'Menanyakan Rencana Orang Lain Secara Sangat Sopan (Polite Inquiry)',
        situation: 'Menanyakan apakah seseorang berniat melakukan sesuatu tanpa terdengar menuntut atau mendesak.',
        examples: [
          {
            en: 'Will you be passing by the supermarket this afternoon?',
            id: 'Apakah Anda akan sedang melewati supermarket sore ini?',
            context: 'Pertanyaan halus untuk menitip sesuatu secara sopan.',
          },
        ],
      },
    ],
    timeSignals: ['this time tomorrow', 'at 9 AM next Monday', 'in a few hours', 'at this time next year'],
    pitfalls: [
      'Rumus wajib menyertakan be sebelum Verb-ing: will + be + V-ing. Menghilangkan be (misal "I will studying") adalah salah.',
    ],
  },

  FUTURE_PERFECT: {
    id: 'FUTURE_PERFECT',
    name: 'Future Perfect Tense',
    tagline: 'Peristiwa yang dipastikan akan sudah selesai tuntas sebelum batas tenggat waktu di masa depan.',
    mindset:
      'Kunci dari Future Perfect adalah TENGGAT WAKTU (DEADLINE). Anda berdiri di masa sekarang dan melihat ke suatu titik di masa depan, lalu memastikan bahwa sebelum titik tersebut tercapai, pekerjaan tersebut sudah selesai 100%.',
    mainFunctions: [
      {
        title: 'Selesai Sebelum Batas Tenggat Masa Depan (Completion Before Future Deadline)',
        situation: 'Menjamin bahwa target atau tugas akan tuntas sebelum waktu tertentu tiba.',
        examples: [
          {
            en: 'By next Friday, our developers will have completed the entire security audit.',
            id: 'Menjelang hari Jumat depan, pengembang kami akan sudah menyelesaikan seluruh audit keamanan.',
            context: 'Target penyelesaian sebelum batas akhir hari Jumat.',
          },
          {
            en: 'She will have finished her medical degree by 2028.',
            id: 'Dia akan sudah menyelesaikan gelar kedokterannya menjelang tahun 2028.',
            context: 'Pencapaian target akademis di masa depan.',
          },
        ],
      },
    ],
    timeSignals: ['by tomorrow', 'by next month', 'by 5 PM', 'by the end of this year', 'before next week'],
    pitfalls: [
      'Preposisi waktu paling khas adalah "by" (artinya menjelang atau sebelum). Jangan tertukar dengan "at" yang menunjuk jam dimulainya aksi.',
      'Rumus verbal: will + have + Verb 3. Bentuk have tidak pernah berubah menjadi has meskipun subjeknya He/She/It.',
    ],
  },

  'FUTURE_PER.CONT': {
    id: 'FUTURE_PER.CONT',
    name: 'Future Perfect Continuous Tense',
    tagline: 'Mengukur akumulasi total durasi aktivitas yang masih berlangsung hingga batas waktu masa depan.',
    mindset:
      'Tense ini digunakan untuk merayakan atau mencatat pencapaian angka waktu (milestone durasi). Berapa lama Anda sudah menjalani suatu hal ketika sebuah tanggal di masa depan akhirnya tiba?',
    mainFunctions: [
      {
        title: 'Akumulasi Total Durasi Hingga Momen Masa Depan (Accumulated Duration at Future Point)',
        situation: 'Menghitung total masa pengabdian, studi, atau pekerjaan hingga batas tahun/bulan tertentu di depan.',
        examples: [
          {
            en: 'By December, I will have been working at this university for ten years.',
            id: 'Menjelang bulan Desember, saya akan sudah genap bekerja di universitas ini selama sepuluh tahun.',
            context: 'Menghitung genap 10 tahun masa kerja pada bulan Desember mendatang.',
          },
        ],
      },
    ],
    timeSignals: ['by next [time] for [duration]', 'by then for [duration]', 'by the end of this month'],
    pitfalls: [
      'Rumus verbal: will + have + been + Verb-ing.',
      'Sangat jarang digunakan dalam obrolan sehari-hari; umumnya penutur asli menyederhanakannya ke Future Perfect biasa.',
    ],
  },

  PAST_FUTURE_SIMPLE: {
    id: 'PAST_FUTURE_SIMPLE',
    name: 'Past Future Simple Tense',
    tagline: 'Masa depan dilihat dari sudut pandang masa lalu, serta pengandaian situasi masa kini (Conditional Type 2).',
    mindset:
      'Bayangkan masa lalu sebagai titik acuan, lalu melihat apa yang "akan" terjadi setelahnya. Sering digunakan untuk menceritakan janji atau niat masa lalu yang belum tentu terwujud, atau kalimat pengandaian jika keadaan sekarang berbeda.',
    mainFunctions: [
      {
        title: 'Masa Depan dari Sudut Pandang Masa Lampau (Future in the Past)',
        situation: 'Menyampaikan kembali janji atau perkataan seseorang di masa lalu (Reported Speech).',
        examples: [
          {
            en: 'He promised that he would send the documents the following day.',
            id: 'Dia berjanji bahwa dia akan mengirimkan dokumen-dokumen itu keesokan harinya.',
            context: 'Janji yang dibuat di masa lampau.',
          },
        ],
      },
      {
        title: 'Pengandaian Situasi Sekarang yang Tidak Nyata (Conditional Type 2)',
        situation: 'Menyatakan apa yang akan Anda lakukan seandainya situasi saat ini berbeda dari kenyataan.',
        examples: [
          {
            en: 'If I had more free time, I would learn how to play the piano.',
            id: 'Jika saya punya lebih banyak waktu luang saat ini, saya akan belajar memainkan piano.',
            context: 'Kenyataannya sekarang pembicara sibuk dan tidak punya waktu luang.',
          },
        ],
      },
    ],
    timeSignals: ['the next day', 'the following day', 'then', 'in that year'],
    pitfalls: [
      'Gunakan modal would + Verb 1 murni.',
      'Pada kalimat pengandaian (Conditional Type 2), to be untuk semua subjek secara formal adalah were (contoh: "If I were you, I would accept the offer").',
    ],
  },

  PAST_FUTURE_CONTINUOUS: {
    id: 'PAST_FUTURE_CONTINUOUS',
    name: 'Past Future Continuous Tense',
    tagline: 'Aksi yang seharusnya diprediksi sedang berlangsung pada jam tertentu di masa lalu, namun terhalang.',
    mindset:
      'Membayangkan diri Anda seharusnya sedang berada di tengah-tengah suatu kegiatan di masa lampau, seandainya rencana tidak berubah atau rintangan tidak terjadi.',
    mainFunctions: [
      {
        title: 'Rencana Sedang Berlangsung di Masa Lalu yang Batal/Terhalang (Imagined Past Ongoing Action)',
        situation: 'Menjelaskan apa yang seharusnya sedang Anda lakukan pada jam tertentu di masa lalu jika rencana berjalan lancar.',
        examples: [
          {
            en: 'I told you I would be waiting for your call at 3 PM yesterday.',
            id: 'Saya sudah bilang padamu bahwa saya seharusnya sedang menunggu teleponmu pukul 3 sore kemarin.',
            context: 'Aktivitas yang direncanakan sedang berlangsung di masa lampau.',
          },
        ],
      },
    ],
    timeSignals: ['at that time', 'when he arrived', 'on that day'],
    pitfalls: [
      'Rumus: would + be + Verb-ing.',
      'Penutur asli modern sering menggantinya dengan frasa yang lebih alami seperti "was supposed to be waiting" atau "was going to be waiting".',
    ],
  },

  PAST_FUTURE_PERFECT: {
    id: 'PAST_FUTURE_PERFECT',
    name: 'Past Future Perfect Tense',
    tagline: 'Peristiwa yang seharusnya sudah selesai di masa lalu seandainya syarat terpenuhi (Penyesalan / Conditional Type 3).',
    mindset:
      'Ini adalah tenses penyesalan atau spekulasi sejarah. Digunakan untuk merenungkan apa yang seharusnya sudah tuntas di masa lampau jika saja keadaan tidak berjalan seperti yang terjadi.',
    mainFunctions: [
      {
        title: 'Hasil Pengandaian Masa Lalu yang Tidak Pernah Terwujud (Unfulfilled Past Result)',
        situation: 'Menyatakan hasil dari pengandaian masa lalu yang sudah tidak bisa diubah lagi.',
        examples: [
          {
            en: 'If you had informed me earlier, I would have attended your graduation ceremony.',
            id: 'Seandainya kamu memberitahuku lebih awal, saya pasti sudah menghadiri upacara wisudamu.',
            context: 'Kenyataannya kamu tidak memberi tahu, dan saya tidak menghadiri wisuda itu.',
          },
        ],
      },
    ],
    timeSignals: ['by then', 'if + Past Perfect', 'by that time'],
    pitfalls: [
      'Rumus: would + have + Verb 3. Jangan pernah gunakan has setelah modal would.',
      'Sering disingkat dalam percakapan cepat menjadi "would’ve" /wʊdəv/.',
    ],
  },

  'PAST_FUTURE_PER.CONT': {
    id: 'PAST_FUTURE_PER.CONT',
    name: 'Past Future Perfect Continuous Tense',
    tagline: 'Akumulasi durasi hipotesis yang seharusnya sudah dan masih berjalan di masa lampau jika tidak terputus.',
    mindset:
      'Tense paling kompleks yang mengukur berapa lama Anda seharusnya sudah berkutat dalam suatu kegiatan pada titik masa lalu seandainya tidak ada peristiwa yang memutuskannya.',
    mainFunctions: [
      {
        title: 'Akumulasi Durasi Hipotesis di Masa Lalu (Hypothetical Past Accumulated Duration)',
        situation: 'Menghitung durasi waktu yang seharusnya tercapai di masa lampau seandainya kondisi terpenuhi.',
        examples: [
          {
            en: 'By 2021, she would have been living in Tokyo for five years if she had not decided to move back.',
            id: 'Menjelang tahun 2021, dia seharusnya sudah genap tinggal di Tokyo selama lima tahun seandainya dia tidak memutuskan untuk pindah kembali.',
            context: 'Kenyataannya dia pindah sebelum genap lima tahun.',
          },
        ],
      },
    ],
    timeSignals: ['by then for [duration]', 'by that time for [duration]'],
    pitfalls: [
      'Rumus: would + have + been + Verb-ing.',
      'Hampir tidak pernah digunakan dalam percakapan kasual sehari-hari; penutur asli menyederhanakannya ke Past Future Perfect atau Past Simple.',
    ],
  },
};

/**
 * Mengambil data penjelasan tenses berdasarkan kombinasi tense dan aspect
 * @param {string} tense 'PRESENT' | 'PAST' | 'FUTURE' | 'PAST_FUTURE'
 * @param {string} aspect 'SIMPLE' | 'CONTINUOUS' | 'PERFECT' | 'PER.CONT'
 * @returns {object} Detail penjelasan tenses
 */
export function getTenseExplanation(tense, aspect) {
  const key = `${tense}_${aspect}`;
  return TENSE_EXPLANATIONS[key] || TENSE_EXPLANATIONS.PRESENT_SIMPLE;
}
