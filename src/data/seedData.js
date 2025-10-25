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
      progress: 0,
      status: "UPCOMING",
      startDate: "2025-06-01",
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

// Initialize wings, floors, and flats for Sunrise Apartments
const sunriseProject = seedData.projects[0]
const greenValleyProject = seedData.projects[1]
const royalHeightsProject = seedData.projects[2]

// Sunrise Apartments - Wing A
const wingA = {
  wingId: generateId(),
  projectId: sunriseProject.projectId,
  wingName: "Wing A",
  noOfFloors: 5,
  noOfProperties: 20,
  isDeleted: false,
}

// Sunrise Apartments - Wing B
const wingB = {
  wingId: generateId(),
  projectId: sunriseProject.projectId,
  wingName: "Wing B",
  noOfFloors: 5,
  noOfProperties: 20,
  isDeleted: false,
}

seedData.wings.push(wingA, wingB)

// Create floors for Wing A
const floorNames = ["Ground", "1st", "2nd", "3rd", "4th"]
const floorData = []

floorNames.forEach((name, index) => {
  const floor = {
    floorId: generateId(),
    projectId: sunriseProject.projectId,
    wingId: wingA.wingId,
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

// Create flats for Wing A
const statuses = ["VACANT", "VACANT", "BOOKED", "BOOKED", "REGISTERED"]
let flatIndex = 0

floorData.forEach((floor) => {
  for (let i = 0; i < 4; i++) {
    const flat = {
      propertyId: generateId(),
      projectId: sunriseProject.projectId,
      wingId: wingA.wingId,
      floorId: floor.floorId,
      unitNumber: `A-${floor.floorNo}${i + 1}`,
      status: statuses[flatIndex % statuses.length],
      area: i < 2 ? 1000 : 1500,
      bhk: i < 2 ? "2BHK" : "3BHK",
      isDeleted: false,
    }
    seedData.flats.push(flat)
    flatIndex++
  }
})

// Create floors for Wing B (similar structure)
floorNames.forEach((name, index) => {
  const floor = {
    floorId: generateId(),
    projectId: sunriseProject.projectId,
    wingId: wingB.wingId,
    floorNo: index,
    floorName: name,
    propertyType: "Residential",
    area: 1000,
    quantity: 4,
    isDeleted: false,
  }
  seedData.floors.push(floor)
})

// Create flats for Wing B
const wingBFloors = seedData.floors.filter((f) => f.wingId === wingB.wingId)
flatIndex = 0

wingBFloors.forEach((floor) => {
  for (let i = 0; i < 4; i++) {
    const flat = {
      propertyId: generateId(),
      projectId: sunriseProject.projectId,
      wingId: wingB.wingId,
      floorId: floor.floorId,
      unitNumber: `B-${floor.floorNo}${i + 1}`,
      status: statuses[flatIndex % statuses.length],
      area: i < 2 ? 1000 : 1500,
      bhk: i < 2 ? "2BHK" : "3BHK",
      isDeleted: false,
    }
    seedData.flats.push(flat)
    flatIndex++
  }
})

// Create disbursements for Sunrise Apartments
const disbursements = [
  { title: "Token", description: "Token Amount", percentage: 10 },
  { title: "Foundation", description: "Foundation Work", percentage: 20 },
  { title: "Structure", description: "Structure Work", percentage: 30 },
  { title: "Finishing", description: "Finishing Work", percentage: 25 },
  { title: "Handover", description: "Handover", percentage: 15 },
]

disbursements.forEach((d) => {
  seedData.disbursements.push({
    disbursementId: generateId(),
    projectId: sunriseProject.projectId,
    disbursementTitle: d.title,
    description: d.description,
    percentage: d.percentage,
    isDeleted: false,
  })
})

// Create bank details
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
)

// Create some enquiries
const enquiry1 = {
  enquiryId: generateId(),
  projectId: sunriseProject.projectId,
  clientId: seedData.clients[0].clientId,
  propertyId: seedData.flats[0].propertyId,
  budget: "₹50-60 Lakhs",
  reference: "Website",
  referenceName: "Google Search",
  status: "ONGOING",
  remark: "Interested in 2BHK units",
  createdDate: new Date().toISOString().split("T")[0],
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
  remark: "Looking for 3BHK",
  createdDate: new Date().toISOString().split("T")[0],
  isDeleted: false,
}

seedData.enquiries.push(enquiry1, enquiry2)

// Create some bookings
const booking1 = {
  bookingId: generateId(),
  projectId: sunriseProject.projectId,
  clientId: seedData.clients[2].clientId,
  propertyId: seedData.flats[2].propertyId,
  enquiryId: null,
  bookingAmount: "100000",
  agreementAmount: "5000000",
  bookingDate: "2024-01-15",
  chequeNo: "CH001",
  gstPercentage: 18,
  isRegistered: false,
  isCancelled: false,
  isDeleted: false,
}

seedData.bookings.push(booking1)

// Update flat status to BOOKED
const bookedFlat = seedData.flats.find((f) => f.propertyId === booking1.propertyId)
if (bookedFlat) bookedFlat.status = "BOOKED"

// Create amenities
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
]

seedData.amenities = amenities.map((name) => ({
  amenityId: generateId(),
  projectId: sunriseProject.projectId,
  amenityName: name,
  isDeleted: false,
}))

// Create documents
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
)

// Create activity log
seedData.activityLog = [
  {
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: "Agent Smith",
    action: "Booked",
    entity: "Unit A-101",
    details: "₹50,000",
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
    user: "Sarah Johnson",
    action: "Created",
    entity: "Enquiry",
    details: "Unit B-203",
  },
]

// Create notifications
seedData.notifications = [
  {
    notificationId: generateId(),
    type: "ENQUIRY_FOLLOWUP",
    title: "Follow-up due for Rajesh Kumar",
    description: "Enquiry for Unit A-101 needs follow-up",
    timestamp: new Date().toISOString(),
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
]
