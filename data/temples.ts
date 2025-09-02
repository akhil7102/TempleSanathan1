export interface Temple {
  id: string;
  name: {
    english: string;
    telugu: string;
  };
  deity: {
    english: string;
    telugu: string;
  };
  district: string;
  state: 'TS' | 'AP';
  location: {
    latitude: number;
    longitude: number;
    address: {
      english: string;
      telugu: string;
    };
  };
  description: {
    english: string;
    telugu: string;
  };
  history: {
    english: string;
    telugu: string;
  };
  timings: {
    morning: string;
    evening: string;
    pujaTimings: string[];
  };
  festivals: Array<{
    name: {
      english: string;
      telugu: string;
    };
    description: {
      english: string;
      telugu: string;
    };
    date: string;
  }>;
  images: string[];
  contact: {
    phone?: string;
    website?: string;
    email?: string;
  };
  features: string[];
  isOpen: boolean;
  popularity: number;
  templeType: 'Ancient' | 'Hill' | 'River' | 'Modern';
}

export const districts = {
  TS: [
    'Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam',
    'Nalgonda', 'Mahbubnagar', 'Rangareddy', 'Medchal-Malkajgiri',
    'Sangareddy', 'Siddipet', 'Yadadri Bhuvanagiri', 'Rajanna Sircilla',
    'Bhadradri Kothagudem', 'Mulugu', 'Nirmal', 'Jayashankar Bhupalpally',
    'Jogulamba Gadwal', 'Wanaparthy', 'Medak', 'Suryapet'
  ],
  AP: [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
    'Rajahmundry', 'Tirupati', 'Kakinada', 'Anantapur', 'Chittoor',
    'Srikakulam', 'Vizianagaram', 'Kadapa', 'Eluru', 'Ongole',
    'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur'
  ]
};

export const deities = [
  'Lord Vishnu', 'Lord Shiva', 'Lord Rama', 'Lord Krishna',
  'Lord Ganesha', 'Goddess Durga', 'Goddess Lakshmi', 'Lord Hanuman',
  'Lord Venkateswara', 'Lord Narasimha', 'Goddess Saraswati'
];

export const templeTypes = ['Ancient', 'Hill', 'River', 'Modern'];

export const templesData: Temple[] = [
  {
    id: '1',
    name: {
      english: 'Tirumala Venkateswara Temple',
      telugu: 'తిరుమల వేంకటేశ్వర ఆలయం'
    },
    deity: {
      english: 'Lord Venkateswara',
      telugu: 'వేంకటేశ్వర స్వామి'
    },
    district: 'Tirupati',
    state: 'AP',
    location: {
      latitude: 13.6833,
      longitude: 79.3167,
      address: {
        english: 'Tirumala, Tirupati, Andhra Pradesh',
        telugu: 'తిరుమల, తిరుపతి, ఆంధ్రప్రదేశ్'
      }
    },
    description: {
      english: 'Famous hill temple dedicated to Lord Venkateswara, one of the richest temples in the world.',
      telugu: 'వేంకటేశ్వర స్వామికి అంకితమైన ప్రసిద్ధ కొండ ఆలయం, ప్రపంచంలోని అత్యంత ధనిక ఆలయాలలో ఒకటి.'
    },
    history: {
      english: 'Ancient temple with rich history dating back thousands of years.',
      telugu: 'వేలాది సంవత్సరాల చరిత్ర కలిగిన పురాతన ఆలయం.'
    },
    timings: {
      morning: '5:00 AM - 12:00 PM',
      evening: '4:00 PM - 9:00 PM',
      pujaTimings: ['6:00 AM', '9:00 AM', '12:00 PM', '6:00 PM', '8:00 PM']
    },
    festivals: [
      {
        name: {
          english: 'Brahmotsavam',
          telugu: 'బ్రహ్మోత్సవం'
        },
        description: {
          english: 'Annual festival celebrating Lord Venkateswara',
          telugu: 'వేంకటేశ్వర స్వామి వార్షిక ఉత్సవం'
        },
        date: '2024-09-15'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600'
    ],
    contact: {
      phone: '+91-877-2277777',
      website: 'https://tirumala.org',
      email: 'info@tirumala.org'
    },
    features: ['Parking', 'Prasadam', 'Accommodation', 'Wheelchair Access'],
    isOpen: true,
    popularity: 5,
    templeType: 'Hill'
  },
  {
    id: '2',
    name: {
      english: 'Bhadrachalam Temple',
      telugu: 'భద్రాచలం ఆలయం'
    },
    deity: {
      english: 'Lord Rama',
      telugu: 'శ్రీ రామ'
    },
    district: 'Bhadradri Kothagudem',
    state: 'TS',
    location: {
      latitude: 17.6698,
      longitude: 80.8931,
      address: {
        english: 'Bhadrachalam, Bhadradri Kothagudem, Telangana',
        telugu: 'భద్రాచలం, భద్రాద్రి కొత్తగూడెం, తెలంగాణ'
      }
    },
    description: {
      english: 'Sacred temple dedicated to Lord Rama, located on the banks of river Godavari.',
      telugu: 'గోదావరి నది ఒడ్డున ఉన్న శ్రీ రామునికి అంకితమైన పవిత్ర ఆలయం.'
    },
    history: {
      english: 'Historic temple with connections to the Ramayana epic.',
      telugu: 'రామాయణ మహాకావ్యంతో సంబంధం కలిగిన చారిత్రక ఆలయం.'
    },
    timings: {
      morning: '4:00 AM - 1:00 PM',
      evening: '3:00 PM - 10:00 PM',
      pujaTimings: ['5:00 AM', '8:00 AM', '12:00 PM', '7:00 PM']
    },
    festivals: [
      {
        name: {
          english: 'Sri Rama Navami',
          telugu: 'శ్రీ రామ నవమి'
        },
        description: {
          english: 'Celebration of Lord Rama\'s birth',
          telugu: 'శ్రీ రామ జన్మోత్సవం'
        },
        date: '2024-04-17'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600'
    ],
    contact: {
      phone: '+91-8744-222333'
    },
    features: ['River View', 'Prasadam', 'Parking', 'Boat Services'],
    isOpen: true,
    popularity: 4,
    templeType: 'River'
  }
];