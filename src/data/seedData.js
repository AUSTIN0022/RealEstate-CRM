import { v4 as uuidv4 } from "uuid"

const generateId = () => uuidv4()

export const seedData = {
  organization: {
    orgId: generateId(),
    orgName: "PropEase Real Estate",
    orgEmail: "admin@propease.com",
    address: "Mumbai, India",
    isDeleted: false,
  },

  users: [
    {
      userId: generateId(),
      username: "admin@propease.test",
      passwordHash: "1234",
      fullName: "Admin User",
      mobileNumber: "9876543200",
      email: "admin@propease.test",
      enabled: true,
      role: "ADMIN",
      isDeleted: false,
    },
    {
      userId: generateId(),
      username: "agent@propease.test",
      passwordHash: "1234",
      fullName: "Agent Smith",
      mobileNumber: "9876543210",
      email: "agent@propease.test",
      enabled: true,
      role: "EMPLOYEE",
      isDeleted: false,
    },
    {
      userId: generateId(),
      username: "sarah@propease.test",
      passwordHash: "1234",
      fullName: "Sarah Johnson",
      mobileNumber: "9876543211",
      email: "sarah@propease.test",
      enabled: true,
      role: "EMPLOYEE",
      isDeleted: false,
    },
    {
      userId: generateId(),
      username: "mike@propease.test",
      passwordHash: "1234",
      fullName: "Mike Wilson",
      mobileNumber: "9876543212",
      email: "mike@propease.test",
      enabled: true,
      role: "EMPLOYEE",
      isDeleted: false,
    },
    {
      userId: generateId(),
      username: "priya@propease.test",
      passwordHash: "1234",
      fullName: "Priya Verma",
      mobileNumber: "9876543213",
      email: "priya@propease.test",
      enabled: true,
      role: "EMPLOYEE",
      isDeleted: false,
    },
    {
      userId: generateId(),
      username: "arjun@propease.test",
      passwordHash: "1234",
      fullName: "Arjun Kapoor",
      mobileNumber: "9876543214",
      email: "arjun@propease.test",
      enabled: true,
      role: "EMPLOYEE",
      isDeleted: false,
    },
  ],

  projects: [
    {
      projectId: generateId(),
      projectName: "Sunrise Apartments",
      progress: 60,
      status: "IN_PROGRESS",
      startDate: "2023-01-15",
      completionDate: "2025-12-31",
      mahareraNo: "P52100012345",
      letterHeadFileURL: "/placeholder.svg",
      projectAddress: "Plot No 45, Sector 21, Mumbai",
      isDeleted: false,
    },
    {
      projectId: generateId(),
      projectName: "Green Valley Residency",
      progress: 35,
      status: "IN_PROGRESS",
      startDate: "2024-06-01",
      completionDate: "2027-12-31",
      mahareraNo: "P52100067890",
      letterHeadFileURL: "/placeholder.svg",
      projectAddress: "Plot No 12, Sector 45, Bangalore",
      isDeleted: false,
    },
    {
      projectId: generateId(),
      projectName: "Royal Heights",
      progress: 100,
      status: "COMPLETED",
      startDate: "2021-01-01",
      completionDate: "2024-06-30",
      mahareraNo: "P52100098765",
      letterHeadFileURL: "/placeholder.svg",
      projectAddress: "Plot No 78, Sector 12, Pune",
      isDeleted: false,
    },
    {
      projectId: generateId(),
      projectName: "Lakeside Towers",
      progress: 45,
      status: "IN_PROGRESS",
      startDate: "2023-09-01",
      completionDate: "2026-06-30",
      mahareraNo: "P52100054321",
      letterHeadFileURL: "/placeholder.svg",
      projectAddress: "Plot No 89, Sector 33, Hyderabad",
      isDeleted: false,
    },
    {
      projectId: generateId(),
      projectName: "Urban Nest",
      progress: 0,
      status: "UPCOMING",
      startDate: "2025-12-01",
      completionDate: "2028-12-31",
      mahareraNo: "P52100011111",
      letterHeadFileURL: "/placeholder.svg",
      projectAddress: "Plot No 56, Sector 18, Delhi",
      isDeleted: false,
    },
  ],

  clients: [
    {
      clientId: generateId(),
      clientName: "Rajesh Kumar",
      email: "rajesh@example.com",
      mobileNumber: "9876543210",
      dob: "1985-05-15",
      city: "Mumbai",
      address: "123 Main Street, Mumbai",
      occupation: "Software Engineer",
      company: "Infosys",
      panNo: "ABCDE1234F",
      aadharNo: "123456789012",
      createdDate: "2024-08-10",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Priya Sharma",
      email: "priya@example.com",
      mobileNumber: "9876543211",
      dob: "1990-03-22",
      city: "Mumbai",
      address: "456 Oak Avenue, Mumbai",
      occupation: "Doctor",
      company: "Apollo Hospital",
      panNo: "BCDEF2345G",
      aadharNo: "234567890123",
      createdDate: "2024-07-15",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Amit Patel",
      email: "amit@example.com",
      mobileNumber: "9876543212",
      dob: "1988-07-10",
      city: "Bangalore",
      address: "789 Pine Road, Bangalore",
      occupation: "Business Owner",
      company: "Patel Enterprises",
      panNo: "CDEFG3456H",
      aadharNo: "345678901234",
      createdDate: "2024-06-20",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Sneha Reddy",
      email: "sneha@example.com",
      mobileNumber: "9876543213",
      dob: "1992-11-05",
      city: "Hyderabad",
      address: "321 Elm Street, Hyderabad",
      occupation: "Architect",
      company: "Design Studios",
      panNo: "DEFGH4567I",
      aadharNo: "456789012345",
      createdDate: "2024-09-05",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Vikram Singh",
      email: "vikram@example.com",
      mobileNumber: "9876543214",
      dob: "1987-02-18",
      city: "Delhi",
      address: "654 Maple Drive, Delhi",
      occupation: "Consultant",
      company: "McKinsey",
      panNo: "EFGHI5678J",
      aadharNo: "567890123456",
      createdDate: "2024-05-12",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Anita Desai",
      email: "anita@example.com",
      mobileNumber: "9876543215",
      dob: "1991-09-30",
      city: "Mumbai",
      address: "987 Cedar Lane, Mumbai",
      occupation: "Teacher",
      company: "St. Xavier School",
      panNo: "FGHIJ6789K",
      aadharNo: "678901234567",
      createdDate: "2024-08-22",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Rohit Mehta",
      email: "rohit@example.com",
      mobileNumber: "9876543216",
      dob: "1986-04-12",
      city: "Pune",
      address: "147 Birch Street, Pune",
      occupation: "Engineer",
      company: "TCS",
      panNo: "GHIJK7890L",
      aadharNo: "789012345678",
      createdDate: "2024-07-08",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Kavita Iyer",
      email: "kavita@example.com",
      mobileNumber: "9876543217",
      dob: "1993-06-25",
      city: "Bangalore",
      address: "258 Spruce Avenue, Bangalore",
      occupation: "Finance Manager",
      company: "ICICI Bank",
      panNo: "HIJKL8901M",
      aadharNo: "890123456789",
      createdDate: "2024-09-14",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Suresh Nair",
      email: "suresh@example.com",
      mobileNumber: "9876543218",
      dob: "1984-08-14",
      city: "Kochi",
      address: "369 Willow Road, Kochi",
      occupation: "Businessman",
      company: "Nair Trading",
      panNo: "IJKLM9012N",
      aadharNo: "901234567890",
      createdDate: "2024-06-30",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Deepa Joshi",
      email: "deepa@example.com",
      mobileNumber: "9876543219",
      dob: "1989-12-08",
      city: "Ahmedabad",
      address: "741 Ash Court, Ahmedabad",
      occupation: "Lawyer",
      company: "Joshi & Associates",
      panNo: "JKLMN0123O",
      aadharNo: "012345678901",
      createdDate: "2024-08-03",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Nikhil Gupta",
      email: "nikhil@example.com",
      mobileNumber: "9876543220",
      dob: "1994-01-20",
      city: "Mumbai",
      address: "852 Juniper Lane, Mumbai",
      occupation: "IT Manager",
      company: "Google",
      panNo: "KLMNO1234P",
      aadharNo: "123456789013",
      createdDate: "2024-09-18",
      isDeleted: false,
    },
    {
      clientId: generateId(),
      clientName: "Meera Chopra",
      email: "meera@example.com",
      mobileNumber: "9876543221",
      dob: "1988-10-11",
      city: "Bangalore",
      address: "963 Poplar Street, Bangalore",
      occupation: "HR Director",
      company: "Accenture",
      panNo: "LMNOP2345Q",
      aadharNo: "234567890124",
      createdDate: "2024-07-25",
      isDeleted: false,
    },
  ],

  wings: [],
  floors: [],
  flats: [],
  enquiries: [],
  bookings: [],
  followUps: [],
  followUpNodes: [],
  disbursements: [],
  clientDisbursements: [],
  bankDetails: [],
  documents: [],
  notifications: [],
  activityLog: [],
}

const sunriseProject = seedData.projects[0]
const greenValleyProject = seedData.projects[1]
const royalHeightsProject = seedData.projects[2]
const lakesideProject = seedData.projects[3]
const urbanNestProject = seedData.projects[4]

const wingASunrise = {
  wingId: generateId(),
  projectId: sunriseProject.projectId,
  wingName: "Wing A",
  noOfFloors: 5,
  noOfProperties: 20,
  isDeleted: false,
}

const wingBSunrise = {
  wingId: generateId(),
  projectId: sunriseProject.projectId,
  wingName: "Wing B",
  noOfFloors: 5,
  noOfProperties: 20,
  isDeleted: false,
}

const wingCSunrise = {
  wingId: generateId(),
  projectId: sunriseProject.projectId,
  wingName: "Wing C",
  noOfFloors: 4,
  noOfProperties: 16,
  isDeleted: false,
}

const wingAGreen = {
  wingId: generateId(),
  projectId: greenValleyProject.projectId,
  wingName: "Wing A",
  noOfFloors: 6,
  noOfProperties: 24,
  isDeleted: false,
}

const wingBGreen = {
  wingId: generateId(),
  projectId: greenValleyProject.projectId,
  wingName: "Wing B",
  noOfFloors: 6,
  noOfProperties: 24,
  isDeleted: false,
}

seedData.wings.push(wingASunrise, wingBSunrise, wingCSunrise, wingAGreen, wingBGreen)

const floorNames = ["Ground", "1st", "2nd", "3rd", "4th", "5th"]
const floorData = []

// Sunrise Wing A
floorNames.slice(0, 5).forEach((name, index) => {
  const floor = {
    floorId: generateId(),
    projectId: sunriseProject.projectId,
    wingId: wingASunrise.wingId,
    floorNo: index,
    floorName: name,
    propertyType: "Residential",
    area: 1000,
    quantity: 4,
    isDeleted: false,
  }
  floorData.push(floor)
  seedData.floors.push(floor)
})

// Sunrise Wing B
floorNames.slice(0, 5).forEach((name, index) => {
  const floor = {
    floorId: generateId(),
    projectId: sunriseProject.projectId,
    wingId: wingBSunrise.wingId,
    floorNo: index,
    floorName: name,
    propertyType: "Residential",
    area: 1000,
    quantity: 4,
    isDeleted: false,
  }
  seedData.floors.push(floor)
})

// Sunrise Wing C
floorNames.slice(0, 4).forEach((name, index) => {
  const floor = {
    floorId: generateId(),
    projectId: sunriseProject.projectId,
    wingId: wingCSunrise.wingId,
    floorNo: index,
    floorName: name,
    propertyType: "Residential",
    area: 1200,
    quantity: 4,
    isDeleted: false,
  }
  seedData.floors.push(floor)
})

// Green Valley Wing A
floorNames.slice(0, 6).forEach((name, index) => {
  const floor = {
    floorId: generateId(),
    projectId: greenValleyProject.projectId,
    wingId: wingAGreen.wingId,
    floorNo: index,
    floorName: name,
    propertyType: "Residential",
    area: 1100,
    quantity: 4,
    isDeleted: false,
  }
  seedData.floors.push(floor)
})

// Green Valley Wing B
floorNames.slice(0, 6).forEach((name, index) => {
  const floor = {
    floorId: generateId(),
    projectId: greenValleyProject.projectId,
    wingId: wingBGreen.wingId,
    floorNo: index,
    floorName: name,
    propertyType: "Residential",
    area: 1100,
    quantity: 4,
    isDeleted: false,
  }
  seedData.floors.push(floor)
})

const statuses = ["VACANT", "VACANT", "BOOKED", "BOOKED", "REGISTERED", "VACANT"]
let flatIndex = 0

seedData.floors.forEach((floor) => {
  for (let i = 0; i < floor.quantity; i++) {
    const flat = {
      propertyId: generateId(),
      projectId: floor.projectId,
      wingId: floor.wingId,
      floorId: floor.floorId,
      unitNumber: `${floor.wingId.substring(0, 1)}-${floor.floorNo}${i + 1}`,
      status: statuses[flatIndex % statuses.length],
      area: i < 2 ? 1000 : 1500,
      bhk: i < 2 ? "2BHK" : "3BHK",
      isDeleted: false,
    }
    seedData.flats.push(flat)
    flatIndex++
  }
})

const disbursementTemplates = [
  { title: "Token", description: "Token Amount", percentage: 10 },
  { title: "Foundation", description: "Foundation Work", percentage: 20 },
  { title: "Structure", description: "Structure Work", percentage: 30 },
  { title: "Finishing", description: "Finishing Work", percentage: 25 },
  { title: "Handover", description: "Handover", percentage: 15 },
]

seedData.projects.forEach((project) => {
  disbursementTemplates.forEach((d) => {
    seedData.disbursements.push({
      disbursementId: generateId(),
      projectId: project.projectId,
      disbursementTitle: d.title,
      description: d.description,
      percentage: d.percentage,
      isDeleted: false,
    })
  })
})

seedData.bankDetails.push(
  {
    bankDetailId: generateId(),
    projectId: sunriseProject.projectId,
    bankName: "HDFC Bank",
    branchName: "Andheri",
    contactPerson: "Rajesh Gupta",
    contactNumber: "9876543200",
    isDeleted: false,
  },
  {
    bankDetailId: generateId(),
    projectId: sunriseProject.projectId,
    bankName: "SBI",
    branchName: "Kurla",
    contactPerson: "Priya Sharma",
    contactNumber: "9876543201",
    isDeleted: false,
  },
  {
    bankDetailId: generateId(),
    projectId: greenValleyProject.projectId,
    bankName: "ICICI Bank",
    branchName: "Bangalore",
    contactPerson: "Vikram Singh",
    contactNumber: "9876543202",
    isDeleted: false,
  },
  {
    bankDetailId: generateId(),
    projectId: lakesideProject.projectId,
    bankName: "Axis Bank",
    branchName: "Hyderabad",
    contactPerson: "Sneha Reddy",
    contactNumber: "9876543203",
    isDeleted: false,
  },
)

const enquiry1 = {
  enquiryId: generateId(),
  projectId: sunriseProject.projectId,
  clientId: seedData.clients[0].clientId,
  propertyId: seedData.flats[0].propertyId,
  budget: "₹50-60 Lakhs",
  reference: "Website",
  referenceName: "Google Search",
  status: "ONGOING",
  remark: "Interested in 2BHK units, wants to visit site",
  createdDate: "2024-09-10",
  isDeleted: false,
}

const enquiry2 = {
  enquiryId: generateId(),
  projectId: sunriseProject.projectId,
  clientId: seedData.clients[1].clientId,
  propertyId: seedData.flats[1].propertyId,
  budget: "₹60-70 Lakhs",
  reference: "Referral",
  referenceName: "Friend",
  status: "ONGOING",
  remark: "Looking for 3BHK, family of 4",
  createdDate: "2024-08-25",
  isDeleted: false,
}

const enquiry3 = {
  enquiryId: generateId(),
  projectId: greenValleyProject.projectId,
  clientId: seedData.clients[3].clientId,
  propertyId: seedData.flats[20].propertyId,
  budget: "₹70-80 Lakhs",
  reference: "Advertisement",
  referenceName: "Facebook Ad",
  status: "ONGOING",
  remark: "Investment purpose, wants rental income",
  createdDate: "2024-09-01",
  isDeleted: false,
}

const enquiry4 = {
  enquiryId: generateId(),
  projectId: sunriseProject.projectId,
  clientId: seedData.clients[4].clientId,
  propertyId: seedData.flats[5].propertyId,
  budget: "₹80-90 Lakhs",
  reference: "Broker",
  referenceName: "Local Broker",
  status: "CONVERTED",
  remark: "Converted to booking",
  createdDate: "2024-07-15",
  isDeleted: false,
}

const enquiry5 = {
  enquiryId: generateId(),
  projectId: lakesideProject.projectId,
  clientId: seedData.clients[6].clientId,
  propertyId: seedData.flats[40].propertyId,
  budget: "₹55-65 Lakhs",
  reference: "Website",
  referenceName: "Direct Search",
  status: "ONGOING",
  remark: "First time buyer, needs financing",
  createdDate: "2024-09-15",
  isDeleted: false,
}

const enquiry6 = {
  enquiryId: generateId(),
  projectId: greenValleyProject.projectId,
  clientId: seedData.clients[8].clientId,
  propertyId: seedData.flats[25].propertyId,
  budget: "₹75-85 Lakhs",
  reference: "Referral",
  referenceName: "Existing Client",
  status: "ONGOING",
  remark: "Wants premium unit with amenities",
  createdDate: "2024-09-12",
  isDeleted: false,
}

seedData.enquiries.push(enquiry1, enquiry2, enquiry3, enquiry4, enquiry5, enquiry6)

const booking1 = {
  bookingId: generateId(),
  projectId: sunriseProject.projectId,
  clientId: seedData.clients[2].clientId,
  propertyId: seedData.flats[2].propertyId,
  enquiryId: null,
  bookingAmount: "500000",
  agreementAmount: "5000000",
  bookingDate: "2024-08-15",
  chequeNo: "CH001",
  gstPercentage: 18,
  isRegistered: false,
  isCancelled: false,
  isDeleted: false,
}

const booking2 = {
  bookingId: generateId(),
  projectId: sunriseProject.projectId,
  clientId: seedData.clients[4].clientId,
  propertyId: seedData.flats[5].propertyId,
  enquiryId: enquiry4.enquiryId,
  bookingAmount: "600000",
  agreementAmount: "6000000",
  bookingDate: "2024-07-20",
  chequeNo: "CH002",
  gstPercentage: 18,
  isRegistered: true,
  isCancelled: false,
  isDeleted: false,
}

const booking3 = {
  bookingId: generateId(),
  projectId: greenValleyProject.projectId,
  clientId: seedData.clients[5].clientId,
  propertyId: seedData.flats[22].propertyId,
  enquiryId: null,
  bookingAmount: "550000",
  agreementAmount: "5500000",
  bookingDate: "2024-09-01",
  chequeNo: "CH003",
  gstPercentage: 18,
  isRegistered: false,
  isCancelled: false,
  isDeleted: false,
}

const booking4 = {
  bookingId: generateId(),
  projectId: lakesideProject.projectId,
  clientId: seedData.clients[7].clientId,
  propertyId: seedData.flats[45].propertyId,
  enquiryId: null,
  bookingAmount: "480000",
  agreementAmount: "4800000",
  bookingDate: "2024-08-28",
  chequeNo: "CH004",
  gstPercentage: 18,
  isRegistered: false,
  isCancelled: false,
  isDeleted: false,
}

seedData.bookings.push(booking1, booking2, booking3, booking4)

seedData.flats.forEach((flat) => {
  const booking = seedData.bookings.find((b) => b.propertyId === flat.propertyId)
  if (booking) flat.status = "BOOKED"
})

const amenities = [
  "Gym",
  "Swimming Pool",
  "Garden",
  "Parking",
  "Security",
  "Club House",
  "Yoga Studio",
  "Library",
  "Play Area",
  "Basketball Court",
  "Tennis Court",
  "Jogging Track",
  "Community Hall",
  "Kids Play Zone",
  "Meditation Room",
]

seedData.amenities = amenities.map((name) => ({
  amenityId: generateId(),
  projectId: sunriseProject.projectId,
  amenityName: name,
  isDeleted: false,
}))

seedData.documents.push(
  {
    documentId: generateId(),
    projectId: sunriseProject.projectId,
    documentType: "FloorPlan",
    documentTitle: "Floor Plan - Wing A",
    documentURL: "/placeholder.svg",
    isDeleted: false,
  },
  {
    documentId: generateId(),
    projectId: sunriseProject.projectId,
    documentType: "BasementPlan",
    documentTitle: "Basement Plan",
    documentURL: "/placeholder.svg",
    isDeleted: false,
  },
  {
    documentId: generateId(),
    projectId: sunriseProject.projectId,
    documentType: "SiteLayout",
    documentTitle: "Site Layout Plan",
    documentURL: "/placeholder.svg",
    isDeleted: false,
  },
  {
    documentId: generateId(),
    projectId: greenValleyProject.projectId,
    documentType: "FloorPlan",
    documentTitle: "Floor Plan - Wing A",
    documentURL: "/placeholder.svg",
    isDeleted: false,
  },
)

const today = new Date()
const getDate = (daysOffset) => new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

seedData.followUps = [
  {
    followUpId: generateId(),
    enquiryId: enquiry1.enquiryId,
    followUpDate: getDate(-3),
    followUpTime: "10:00",
    status: "COMPLETED",
    notes: "Initial follow-up for Rajesh Kumar",
    agentName: "Agent Smith",
    createdDate: getDate(-4),
    isDeleted: false,
  },
  {
    followUpId: generateId(),
    enquiryId: enquiry1.enquiryId,
    followUpDate: getDate(0),
    followUpTime: "14:00",
    status: "PENDING",
    notes: "Today's follow-up - check site visit interest",
    agentName: "Agent Smith",
    createdDate: getDate(-1),
    isDeleted: false,
  },
  {
    followUpId: generateId(),
    enquiryId: enquiry1.enquiryId,
    followUpDate: getDate(7),
    followUpTime: "11:00",
    status: "PENDING",
    notes: "Next week follow-up",
    agentName: "Agent Smith",
    createdDate: getDate(-1),
    isDeleted: false,
  },
  {
    followUpId: generateId(),
    enquiryId: enquiry2.enquiryId,
    followUpDate: getDate(-5),
    followUpTime: "09:00",
    status: "COMPLETED",
    notes: "Overdue follow-up completed",
    agentName: "Sarah Johnson",
    createdDate: getDate(-6),
    isDeleted: false,
  },
  {
    followUpId: generateId(),
    enquiryId: enquiry2.enquiryId,
    followUpDate: getDate(-2),
    followUpTime: "15:00",
    status: "PENDING",
    notes: "Overdue - needs immediate attention",
    agentName: "Sarah Johnson",
    createdDate: getDate(-3),
    isDeleted: false,
  },
  {
    followUpId: generateId(),
    enquiryId: enquiry3.enquiryId,
    followUpDate: getDate(0),
    followUpTime: "10:30",
    status: "PENDING",
    notes: "Today's task - investment discussion",
    agentName: "Mike Wilson",
    createdDate: getDate(-1),
    isDeleted: false,
  },
  {
    followUpId: generateId(),
    enquiryId: enquiry5.enquiryId,
    followUpDate: getDate(0),
    followUpTime: "16:00",
    status: "PENDING",
    notes: "Today's task - financing options",
    agentName: "Priya Verma",
    createdDate: getDate(-1),
    isDeleted: false,
  },
  {
    followUpId: generateId(),
    enquiryId: enquiry6.enquiryId,
    followUpDate: getDate(3),
    followUpTime: "11:00",
    status: "PENDING",
    notes: "Upcoming follow-up",
    agentName: "Arjun Kapoor",
    createdDate: getDate(-1),
    isDeleted: false,
  },
]

seedData.followUpNodes = [
  {
    nodeId: generateId(),
    followUpId: seedData.followUps[0].followUpId,
    timestamp: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    note: "Client visited site, very interested",
    agentName: "Agent Smith",
    type: "NOTE",
  },
  {
    nodeId: generateId(),
    followUpId: seedData.followUps[0].followUpId,
    timestamp: new Date(today.getTime() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    note: "Sent quotation and payment plan",
    agentName: "Agent Smith",
    type: "NOTE",
  },
  {
    nodeId: generateId(),
    followUpId: seedData.followUps[1].followUpId,
    timestamp: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    note: "Follow-up Created",
    agentName: "Agent Smith",
    type: "CREATED",
  },
  {
    nodeId: generateId(),
    followUpId: seedData.followUps[3].followUpId,
    timestamp: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    note: "Initial contact made",
    agentName: "Sarah Johnson",
    type: "CREATED",
  },
  {
    nodeId: generateId(),
    followUpId: seedData.followUps[3].followUpId,
    timestamp: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    note: "Discussed budget and preferences",
    agentName: "Sarah Johnson",
    type: "NOTE",
  },
  {
    nodeId: generateId(),
    followUpId: seedData.followUps[3].followUpId,
    timestamp: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    note: "Marked as completed - client satisfied",
    agentName: "Sarah Johnson",
    type: "COMPLETED",
  },
]

seedData.activityLog = [
  {
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    user: "Agent Smith",
    action: "Booked",
    entity: "Unit A-101",
    details: "₹5,00,000",
  },
  {
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: "Sarah Johnson",
    action: "Completed",
    entity: "Follow-up",
    details: "Priya Sharma - Unit B-203",
  },
  {
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    user: "Mike Wilson",
    action: "Created",
    entity: "Enquiry",
    details: "Sneha Reddy - Green Valley",
  },
  {
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: "Admin User",
    action: "Updated",
    entity: "Sunrise Apartments",
    details: "Progress: 60%",
  },
  {
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: "Priya Verma",
    action: "Created",
    entity: "Enquiry",
    details: "Rohit Mehta - Lakeside Towers",
  },
  {
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: "Arjun Kapoor",
    action: "Registered",
    entity: "Booking",
    details: "Vikram Singh - Unit A-105",
  },
]

seedData.notifications = [
  {
    notificationId: generateId(),
    type: "ENQUIRY_FOLLOWUP",
    title: "Follow-up due for Rajesh Kumar",
    description: "Enquiry for Unit A-101 needs follow-up today",
    timestamp: new Date().toISOString(),
    isRead: false,
    isDeleted: false,
  },
  {
    notificationId: generateId(),
    type: "ENQUIRY_FOLLOWUP",
    title: "Overdue follow-up for Priya Sharma",
    description: "Follow-up was due 2 days ago",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDeleted: false,
  },
  {
    notificationId: generateId(),
    type: "PAYMENT_FOLLOWUP",
    title: "Payment reminder for Amit Patel",
    description: "Token amount due for Unit A-103",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDeleted: false,
  },
  {
    notificationId: generateId(),
    type: "BOOKING_CONFIRMATION",
    title: "New booking created",
    description: "Booking confirmed for Meera Chopra - Unit C-205",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isDeleted: false,
  },
  {
    notificationId: generateId(),
    type: "ENQUIRY_FOLLOWUP",
    title: "Follow-up due for Sneha Reddy",
    description: "Investment enquiry needs follow-up",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isDeleted: false,
  },
]
