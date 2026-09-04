/* ==========================================================================
   CU24BCA — Central data
   Edit this file to update subjects, resource links, announcements and
   quick links across the whole site. Nothing else needs to change.
   Subject lists are sourced from Chandigarh University's official 24-batch
   BCA curriculum (cuchd.in — Dept. of Computer Applications).
   ========================================================================== */

window.CU24Data = (function () {
  // ---- Subjects per semester (core subjects; electives summarised) -------
  const SUBJECTS_BY_SEM = {
    1: ["Computer Programming (C)", "Digital Electronics", "Operating System", "Mathematical Foundation", "Office Automation"],
    2: ["Data Structures using C", "Web Designing", "PC Hardware & Troubleshooting", "Probability & Statistics", "Communication Skills"],
    3: ["Object Oriented Programming", "Computer Networks", "Database Management System (DBMS)", "Computer System Architecture", "Web Development"],
    4: ["Java Programming", "Data Science Fundamentals", "UI/UX Design", "AR & VR Fundamentals", "Artificial Intelligence", "Compiler Design"],
    5: ["Python Programming", "Software Engineering", "Virtual Reality", "Animation Fundamentals", "Data Mining", "Minor Project"],
    6: ["Cyber Security", "Linux Administration", "Web Technologies", "Data Analytics", "Major Project"],
  };

  // ---- Resource types + their per-semester Google Drive links -------------
  // status: "live" = real folder link, "soon" = not uploaded yet
  const RESOURCE_TYPES = [
    {
      id: "pyq",
      label: "PYQ Papers",
      icon: "📄",
      description: "Previous year question papers to practice from and understand the exam pattern.",
      pageUrl: "pageimpordata/Pyqpaper/Pyqp.html",
      hero: "Pictures/Pywpheroimg.png",
      links: {
        1: { status: "live", url: "https://drive.google.com/drive/folders/1JoUhivd62CyYuOgJ338WRqdXF6Uqn45V?usp=sharing" },
        2: { status: "live", url: "https://drive.google.com/drive/folders/1VOb7uNHC7DjOdLRDrKFk2pnGoC37pvzM?usp=sharing" },
        3: { status: "soon" }, 4: { status: "soon" }, 5: { status: "soon" }, 6: { status: "soon" },
      },
    },
    {
      id: "notes",
      label: "Notes",
      icon: "📚",
      description: "Semester-wise handwritten and typed notes covering the full syllabus.",
      pageUrl: "pageimpordata/Notes/Notes.html",
      hero: "Pictures/Notesheroimg.png",
      links: {
        1: { status: "live", url: "https://drive.google.com/drive/folders/1EAcg7t8XBQNdLR8ts5cLVtrjd_XuNvPw?usp=sharing" },
        2: { status: "live", url: "https://drive.google.com/drive/folders/1FNg4fL8cpHgzy33-iDnUpnvqocK3JnaO?usp=sharing" },
        3: { status: "soon" }, 4: { status: "soon" }, 5: { status: "soon" }, 6: { status: "soon" },
      },
    },
    {
      id: "assignment",
      label: "Assignments",
      icon: "📝",
      description: "Submission-ready assignment files and solved references by semester.",
      pageUrl: "pageimpordata/Assignment/Assignment.html",
      hero: "Pictures/Assignmentheroimg.png",
      links: {
        1: { status: "live", url: "https://drive.google.com/drive/folders/16FzZS-2bTilpzZwRJNVIDbhvpUBkxzY3?usp=sharing" },
        2: { status: "live", url: "https://drive.google.com/drive/folders/1HAnmXnqUI8CizpPeGrj9xoccp6OWlhup?usp=sharing" },
        3: { status: "live", url: "https://drive.google.com/drive/folders/1Y2rskXkIaHhCt_iPZDG-4xU-msYEwVlA?usp=sharing" },
        4: { status: "soon" }, 5: { status: "soon" }, 6: { status: "soon" },
      },
    },
    {
      id: "experiments",
      label: "Practical / Lab Files",
      icon: "🧪",
      description: "Lab experiment files and practical records for every practical subject.",
      pageUrl: "pageimpordata/Experiments/Experiments.html",
      hero: "Pictures/experimentbgi.png",
      links: {
        1: { status: "live", url: "https://drive.google.com/drive/folders/18Y3z1L3tyqx5_iXwHIgfDEQ_jKCHFwbR?usp=sharing" },
        2: { status: "live", url: "https://drive.google.com/drive/folders/1E0HZJgffDfzbves00OPGEsd2iVAMtIck?usp=sharing" },
        3: { status: "soon" }, 4: { status: "soon" }, 5: { status: "soon" }, 6: { status: "soon" },
      },
    },
  ];

  // ---- Announcements -------------------------------------------------------
  // type: important | new | exam | assignment | notice
  const ANNOUNCEMENTS = [
    {
      id: "a1",
      type: "new",
      icon: "🎉",
      title: "The site has a brand new look",
      body: "Same trusted PYQs, notes and assignments — now with search, bookmarks, dark mode and a much faster experience.",
      date: "2026-08-21",
    },
    {
      id: "a2",
      type: "assignment",
      icon: "📝",
      title: "Semester 3 assignments are live",
      body: "Semester 3 assignment files have been added to the Assignments section — Semester 1 and 2 were already available.",
      date: "2026-08-10",
    },
    {
      id: "a3",
      type: "notice",
      icon: "💬",
      title: "Spotted an error or have material to share?",
      body: "Message the admin on WhatsApp or use the feedback form below — new notes and PYQs get added as students share them.",
      date: "2026-08-01",
    },
  ];

  // ---- Quick links (verified real URLs only) -------------------------------
  const QUICK_LINKS = [
    { label: "CUIMS", icon: "🎓", url: "https://uims.cuchd.in/", description: "Attendance, grades & registration" },
    { label: "Student Login", icon: "🔐", url: "https://students.cuchd.in/", description: "Fee payment & student portal" },
    { label: "LMS Login", icon: "💻", url: "https://lms.cuchd.in/login/index.php", description: "Course content & submissions" },
    { label: "University Library", icon: "📖", url: "https://www.cuchd.in/student-services/libraries.php", description: "E-books & library services" },
    { label: "Academic Calendar", icon: "📅", url: "https://www.cuchd.in/academics/academic-calendar.php", description: "Semester dates & holidays" },
    { label: "BCA Curriculum", icon: "🗂️", url: "https://www.cuchd.in/uic/computing/bca-course-curriculum.php", description: "Official CU course structure" },
  ];

  // ---- Notices (Daily Updates) ----------------------------------------------
  // type: important | notice | academic | event
  const NOTICES = [
    {
      id: "n1",
      type: "important",
      icon: "🔔",
      title: "Semester 3 Mid-Term Schedule Released",
      body: "Mid-term examinations for Semester 3 will commence from September 15th. Check the detailed date sheet on LMS and plan your preparation accordingly.",
      date: "2026-08-25",
    },
    {
      id: "n2",
      type: "academic",
      icon: "📚",
      title: "New Lab Manuals Uploaded for Sem 2",
      body: "Updated lab manuals for Web Designing and PC Hardware & Troubleshooting are now available in the Practicals section. Download before your next lab session.",
      date: "2026-08-22",
    },
    {
      id: "n3",
      type: "notice",
      icon: "📢",
      title: "Library Extended Hours During Exam Prep",
      body: "Central library will remain open till 10 PM from Sept 1st–30th for exam preparation. Carry your student ID for entry after 8 PM.",
      date: "2026-08-20",
    },
    {
      id: "n4",
      type: "event",
      icon: "🎯",
      title: "Tech Talk: \"Getting Started with Open Source\" — Sept 5",
      body: "Join our alumni speaker for a session on contributing to open source, building a GitHub profile, and landing your first internship. Register via the community WhatsApp group.",
      date: "2026-08-18",
    },
    {
      id: "n5",
      type: "academic",
      icon: "📝",
      title: "Assignment Deadline Extended — Sem 1 C Programming",
      body: "Due to the holiday on Aug 19th, the submission deadline for C Programming Assignment 3 is now Aug 26th, 11:59 PM. Upload on LMS.",
      date: "2026-08-16",
    },
    {
      id: "n6",
      type: "important",
      icon: "⚠️",
      title: "Anti-Ragging Helpline Numbers Updated",
      body: "National Anti-Ragging Helpline: 1800-180-5522 (24x7). University committee contacts are posted on the department notice board and the student portal.",
      date: "2026-08-10",
    },
  ];

  // ---- Semester labels ------------------------------------------------------
  const SEM_LABELS = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th" };

  return { SUBJECTS_BY_SEM, RESOURCE_TYPES, ANNOUNCEMENTS, NOTICES, QUICK_LINKS, SEM_LABELS };
})();
