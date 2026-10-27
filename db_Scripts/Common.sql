
CREATE TABLE lkp_hospital_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_hospital_type (name) VALUES
('TAEI'),
('Non TAEI');

CREATE TABLE lkp_destination_hospital (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_destination_hospital (name) VALUES
('Hospital listed should be viewed');

CREATE TABLE lkp_reason_for_referral (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_reason_for_referral (name) VALUES
('Specialist Care Needed'),
('Interventional Facility not available'),
('Others (specify)');

CREATE TABLE lkp_condition_of_patient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_condition_of_patient (name) VALUES
('Stable'),
('Critical'),
('Very Critical');


-- CREATE TABLE lkp_district (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256) NOT NULL UNIQUE,
--     is_enabled BOOLEAN DEFAULT TRUE
-- );

-- INSERT INTO lkp_district (name) VALUES
-- ('TamilNadu'),
-- ('Kerala'),
-- ('Karnataka');
-- Create table
CREATE TABLE lkp_district (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);

-- Insert data
INSERT INTO lkp_district (id, name, code) VALUES
(1, 'Ariyalur', 'ARI'),
(2, 'Chengalpattu', 'SAD'),
(3, 'Chennai', 'CHE'),
(4, 'Coimbatore', 'CBE'),
(5, 'Cuddalore', 'CUD'),
(6, 'Dharmapuri', 'DPI'),
(7, 'Dindigul', 'DGL'),
(8, 'Erode', 'ERD'),
(9, 'Kallakurichi', 'KKR'),
(10, 'Kancheepuram', 'KPM'),
(11, 'Kanniyakumari', 'KKM'),
(12, 'Karur', 'KAR'),
(13, 'Krishnagiri', 'KGI'),
(14, 'Madurai', 'MDU'),
(15, 'Mayiladuthurai', 'MAT'),
(16, 'Nagapattinam', 'NGP'),
(17, 'Namakkal', 'NKL'),
(18, 'Perambalur', 'PMB'),
(19, 'Pudukkottai', 'PDK'),
(20, 'Ramanathapuram', 'RMD'),
(21, 'Ranipet', 'RPT'),
(22, 'Salem', 'SLM'),
(23, 'Sivagangai', 'SVG'),
(24, 'Tenkasi', 'TKI'),
(25, 'Thanjavur', 'TNJ'),
(26, 'The Nilgiris', 'NLG'),
(27, 'Theni', 'THN'),
(28, 'Thiruchirappalli', 'TRI'),
(29, 'Thiruvarur', 'TVR'),
(30, 'Thoothukudi', 'TUT'),
(31, 'Tirunelveli', 'TNV'),
(32, 'Tirupathur', 'TPT'),
(33, 'Tiruppur', 'TPR'),
(34, 'Tiruvallur', 'TLR'),
(35, 'Tiruvannamalai', 'TVM'),
(36, 'Vellore', 'VEL'),
(37, 'Villupuram', 'VPM'),
(38, 'Virudhunagar', 'VNR');


CREATE TABLE lkp_state (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_state (id, name, code) VALUES
(33, 'Tamil Nadu', 'TN');






CREATE TABLE lkp_hospitals (
    HospitalId INT PRIMARY KEY,
    DistrictName VARCHAR(100) NOT NULL,
    HospitalName VARCHAR(255) NOT NULL,
    MainHospitalType INT,
    HospitalType VARCHAR(50),
    HospitalName108 VARCHAR(255),
    Type_of_Hospital VARCHAR(50),
    Institution_Code VARCHAR(50),
    StateCode INT,
    District_Id INT
);


INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1, 
    'Ariyalur', 
    'Government Ariyalur Medical College Hospital', 
    1, 
    'MCH', 
    'ARIYALUR GH', 
    'Government', 
    15098, 
    33, 
    1);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (2, 
    'Ariyalur', 
    'Government Taluk Hospital, Jeyamkondan, Ariyalur', 
    3, 
    'TK', 
    'JAYAMKONDAN GH', 
    'Government', 
    128, 
    33, 
    1);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (3, 
    'Chengalpattu', 
    'Government Chengalpatu Medical College Hospital', 
    1, 
    'MCH', 
    'CHENGALPATTU MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15003, 
    33, 
    2);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (4, 
    'Chengalpattu', 
    'Government Taluk Hospital, Tambaram, Chengalpattu', 
    3, 
    'TK', 
    'TAMBARAM GH', 
    'Government', 
    17, 
    33, 
    2);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (5, 
    'Chennai', 
    'Rajiv Gandhi Government General Hospital, Madras Medical College, Chennai', 
    1, 
    'MCH', 
    'RAJIVGANDHI GOVT MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15040, 
    33, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (6, 
    'Chennai', 
    'Government Stanley Medical College Hospital, Chennai', 
    1, 
    'MCH', 
    'STANLEY MCH', 
    'Government', 
    15025, 
    33, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (7, 
    'Chennai', 
    'Government Kilpauk Medical College Hospital, Chennai', 
    1, 
    'MCH', 
    'KILPAUK MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15019, 
    33, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (8, 
    'Chennai', 
    'Government Medical College OmandurarGovernment Estate, Chennai', 
    1, 
    'MCH', 
    'OMANDHURAR MEDICAL COLLEGE', 
    'Government', 
    15080, 
    33, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (9, 
    'Chennai', 
    'Government Royapettah Hospital, Kilpauk Medical College, Chennai', 
    1, 
    'MCH', 
    'ROYAPETTAH GH', 
    'Government', 
    15044, 
    33, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (11, 
    'Coimbatore', 
    'Government District Head Quarters Hospital, Pollachi, Coimbatore', 
    3, 
    'HQRS', 
    'POLLACHI GH', 
    'Government', 
    93, 
    33, 
    4);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (12, 
    'Coimbatore', 
    'Government Coimbatore Medical College Hospital', 
    1, 
    'MCH', 
    'COIMBATORE  MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15006, 
    33, 
    4);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (13, 
    'Coimbatore', 
    'Government Taluk Hospital, Metupalayam, Coimbatore', 
    3, 
    'TK', 
    'METTUPALAYAM GH', 
    'Government', 
    90, 
    33, 
    4);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (14, 
    'Cuddalore', 
    'Government District Head Quarters Hospital, Cuddalore', 
    3, 
    'HQRS', 
    'CUDDALORE GH', 
    'Government', 
    135, 
    33, 
    5);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (15, 
    'Dharmapuri', 
    'Government District Head Quarters Hospital, Pennagaram, Dharmapuri', 
    3, 
    'HQRS', 
    'PENNAGARAM GH', 
    'Government', 
    34, 
    33, 
    6);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (16, 
    'Dharmapuri', 
    'Government Dharmapuri Medical College Hospital', 
    1, 
    'MCH', 
    'DHARMAPURI MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15068, 
    33, 
    6);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (17, 
    'Dharmapuri', 
    'Government Taluk Hospital, Harur, Dharmapuri', 
    3, 
    'TK', 
    'HARUR GH', 
    'Government', 
    31, 
    33, 
    6);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (18, 
    'Dindugal', 
    'Government Dindugal Medical College Hospital', 
    1, 
    'MCH', 
    'DINDIGUL GH', 
    'Government', 
    15102, 
    33, 
    7);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (19, 
    'Dindugal', 
    'Government Taluk Hospital, Kodaikanal, Dindugal', 
    3, 
    'TK', 
    'KODAIKANAL GH', 
    'Government', 
    103, 
    33, 
    7);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (20, 
    'Dindugal', 
    'Government Taluk Hospital, Palani, Dindugal', 
    3, 
    'TK', 
    'PALANI GH', 
    'Government', 
    107, 
    33, 
    7);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (21, 
    'Erode', 
    'ThanthaiPeriyar Government District Head Quarters Hospital, Erode', 
    3, 
    'HQRS', 
    'ERODE GH', 
    'Government', 
    72, 
    33, 
    8);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (22, 
    'Erode', 
    'Government IRT Perundurai Medical College, Erode', 
    1, 
    'MCH', 
    'PERUNDURAI MEDICAL COLLEGE', 
    'Government', 
    15096, 
    33, 
    8);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (23, 
    'Erode', 
    'Government Bhavani Hospital, Erode', 
    3, 
    'TK', 
    'BHAVANI GH', 
    'Government', 
    70, 
    33, 
    8);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (24, 
    'Kallakuruchi', 
    'Government Kallakuruchi Medical College Hospital', 
    1, 
    'MCH', 
    'KALLAKURICHI MCH', 
    'Government', 
    15101, 
    33, 
    9);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (25, 
    'Kallakuruchi', 
    'Government Taluk Hospital, Ulundurpet, Kallakuruchi', 
    3, 
    'TK', 
    'ULUNDURPET GH', 
    'Government', 
    48, 
    33, 
    9);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (26, 
    'Kancheepuram', 
    'Government District Head Quarters Hospital, Kancheepuram', 
    3, 
    'HQRS', 
    'KANCHEEPURAM GH', 
    'Government', 
    13, 
    33, 
    10);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (27, 
    'Kancheepuram', 
    'Government Sriperumbudur Hospital, Kancheepuram', 
    3, 
    'TK', 
    'SRIPERUMPUDUR GH', 
    'Government', 
    16, 
    33, 
    10);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (28, 
    'Kanyakumari', 
    'Government District Head Quarters Hospital, Padmanabapuram, Kanyakumari', 
    3, 
    'HQRS', 
    'THUCKALAY GH', 
    'Government', 
    263, 
    33, 
    11);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (29, 
    'Kanyakumari', 
    'Government Kanyakumari Medical College Hospital', 
    1, 
    'MCH', 
    'ASARIPALLAM MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15012, 
    33, 
    11);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (30, 
    'Karur', 
    'Government District Head Quarters Hospital, Kulithalai, Karur', 
    3, 
    'HQRS', 
    'KULITHALAI GH', 
    'Government', 
    115, 
    33, 
    12);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (31, 
    'Karur', 
    'Government Karur Medical College Hospital', 
    1, 
    'MCH', 
    'KARUR MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15090, 
    33, 
    12);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (32, 
    'Krishnagiri', 
    'Government Krishnagiri Medical College Hospital', 
    1, 
    'MCH', 
    'KRISHNAGIRI MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15107, 
    33, 
    13);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (33, 
    'Krishnagiri', 
    'Government Taluk Hospital, Hosur, Krishnagiri', 
    3, 
    'TK', 
    'HOSUR GH', 
    'Government', 
    265, 
    33, 
    13);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (34, 
    'Madurai', 
    'Government District Head Quarters Hospital, Usilampatti, Madurai', 
    3, 
    'HQRS', 
    'USILAMPATTI GH', 
    'Government', 
    207, 
    33, 
    14);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (35, 
    'Madurai', 
    'Government Rajaji Hospital Madurai Medical College', 
    1, 
    'MCH', 
    'GOVTRAJAJI MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15029, 
    33, 
    14);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (36, 
    'Madurai', 
    'Government Taluk Hospital, Melur, Madurai', 
    3, 
    'TK', 
    'MELUR GH', 
    '', 
    NULL, 
    33, 
    14);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (37, 
    'Nagapattinam', 
    'Government Nagapattinum Medical College Hospital', 
    1, 
    'MCH', 
    'NAGAPATTINAM MEDICAL COLLEGE', 
    'Government', 
    15106, 
    33, 
    15);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (38, 
    'Nagapattinam', 
    'Government Periyar Hospital, Mayiladurai, Nagapattinam', 
    3, 
    'TK', 
    'MAYILADUTHURAI GH', 
    'Government', 
    145, 
    33, 
    15);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (39, 
    'Namakkal', 
    'Government Namakkal Medical College Hospital', 
    1, 
    'MCH', 
    'NAMAKKAL MEDICAL COLLEGE', 
    'Government', 
    15103, 
    33, 
    16);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (40, 
    'Perambalur', 
    'Government District Head Quarters Hospital, Perambalur', 
    3, 
    'HQRS', 
    'PERAMBALUR GOVERMENT HEAD QUARTERS HOSPITAL', 
    'Government', 
    130, 
    33, 
    17);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (41, 
    'Pudukottai', 
    'Government District Head Quarters Hospital, Aranthangi, Pudukottai', 
    3, 
    'HQRS', 
    'ARANTHANGI GH', 
    'Government', 
    177, 
    33, 
    18);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (42, 
    'Pudukottai', 
    'Government Pudukottai Medical College Hospital', 
    1, 
    'MCH', 
    'PUDUKKOTTAI MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15092, 
    33, 
    18);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (43, 
    'Pudukottai', 
    'Government Taluk Hospital, Viralimalai, Pudukottai', 
    3, 
    'TK', 
    'VIRALIMALAI GH', 
    'Government', 
    304, 
    33, 
    18);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (44, 
    'Ramanathapuram', 
    'RAMANATHAPURAM MCH', 
    1, 
    'MCH', 
    'RAMANATHAPURAM MEDICAL COLLEGE', 
    'Government', 
    15104, 
    33, 
    19);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (45, 
    'Ranipet', 
    'Government District Head Quarters Hospital, Walajapet, Ranipet', 
    3, 
    'HQRS', 
    'WALAJAH GH', 
    'Government', 
    29, 
    33, 
    20);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (46, 
    'Salem', 
    'Government District Head Quarters Hospital, Mettur Dam, Salem', 
    3, 
    'HQRS', 
    'METTUR DAM GH', 
    'Government', 
    56, 
    33, 
    21);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (47, 
    'Salem', 
    'Government Mohan Kumaramangalam Medical College Hospital, Salem', 
    1, 
    'MCH', 
    'SALEM MEDICAL COLLEGE', 
    'Government', 
    15005, 
    33, 
    21);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (48, 
    'Salem', 
    'Government Taluk Hospital, Attur, Salem', 
    3, 
    'TK', 
    'ATTUR GH', 
    'Government', 
    52, 
    33, 
    21);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (49, 
    'Salem', 
    'Government Taluk Hospital, Omalur, Salem', 
    3, 
    'TK', 
    'OMALUR GH', 
    'Government', 
    57, 
    33, 
    21);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (50, 
    'Salem', 
    'Government Taluk Hospital, Sankagiri, Salem', 
    3, 
    'TK', 
    'SANKAGIRI GH', 
    'Government', 
    58, 
    33, 
    21);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (51, 
    'Sivaganga', 
    'Government District Head Quarters Hospital, Karaikudi, Sivaganga', 
    3, 
    'HQRS', 
    'KARAIKUDI GH', 
    'Government', 
    191, 
    33, 
    22);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (52, 
    'Sivaganga', 
    'Government Sivaganga Medical College Hospital', 
    1, 
    'MCH', 
    'SIVAGANGA MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15069, 
    33, 
    22);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (53, 
    'Tenkasi', 
    'Government District Head Quarters Hospital, Tenkasi', 
    3, 
    'HQRS', 
    'TENKASI GH', 
    'Government', 
    254, 
    33, 
    23);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (54, 
    'Thanjavur', 
    'Government District Head Quarters Hospital, Kumbakonam, Thanjavur', 
    3, 
    'HQRS', 
    'KUMBAKONAM GH', 
    'Government', 
    165, 
    33, 
    24);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (55, 
    'Thanjavur', 
    'Government Thanjavur Medical College & Hospital', 
    1, 
    'MCH', 
    'GOVT.RAJAMIRASDAR MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15013, 
    33, 
    24);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (56, 
    'The Nilgiris', 
    'Government Ooty Medical College Hospital, The Nilgiris', 
    1, 
    'MCH', 
    'OOTY GH', 
    '', 
    NULL, 
    33, 
    25);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (57, 
    'Theni', 
    'Government District Head Quarters Hospital, Periakulam, Theni', 
    3, 
    'HQRS', 
    'PERIAKULAM GH', 
    'Government', 
    213, 
    33, 
    26);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (58, 
    'Theni', 
    'Government Theni Medical College Hospital', 
    1, 
    'MCH', 
    'THENI MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15015, 
    33, 
    26);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (59, 
    'Thirupattur', 
    'Government Taluk Hospital Tirupathur,Tirupathur dt', 
    3, 
    'TK', 
    'TIRUPATHUR GH', 
    'Government', 
    27, 
    33, 
    26);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (60, 
    'Thirupattur', 
    'Government Taluk Hospital, Ambur,Thirupattur dt', 
    3, 
    'TK', 
    'AMBUR GH', 
    'Government', 
    20, 
    33, 
    26);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (61, 
    'Thoothukudi', 
    'Government District Head Quarters Hospital, Kovilpatti, Thoothukudi', 
    3, 
    'HQRS', 
    'KOVILPATTI GH', 
    'Government', 
    237, 
    33, 
    27);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (62, 
    'Thoothukudi', 
    'Government Thoothukudi Medical College Hospital', 
    1, 
    'MCH', 
    'THOOTHUKUDI MEDICALCOLLEGE&HOSPITAL', 
    'Government', 
    15011, 
    33, 
    27);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (63, 
    'Tiruchirapalli', 
    'Government District Head Quarters Hospital, Manapparai, Tiruchirapalli', 
    3, 
    'HQRS', 
    'MANAPPARAI GH', 
    'Government', 
    120, 
    33, 
    28);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (64, 
    'Tiruchirapalli', 
    'Mahatma Gandhi Memorial Government Hospital K.A. P. Vishwanathan Government Medical college, Trichy', 
    1, 
    'MCH', 
    'ANNAL GANDHI MEMORIAL TRICHY MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    15033, 
    33, 
    28);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (65, 
    'Tiruchirapalli', 
    'GovernmentTaluk Hospital, Thuraiyur, Tiruchirapalli', 
    3, 
    'TK', 
    'THURAIYUR GH', 
    'Government', 
    125, 
    33, 
    28);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (66, 
    'Tirunelveli', 
    'Government Tirunelveli medical College Hospital', 
    1, 
    'MCH', 
    'TIRUNELVELI MEDICAL COLLEGE&HOSPITAL', 
    'Government', 
    15010, 
    33, 
    29);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (67, 
    'Tirupur', 
    'Government Tiruppur Medical College Hospital', 
    1, 
    'MCH', 
    'TIRUPPUR MEDICAL COLLEGE', 
    'Government', 
    15100, 
    33, 
    30);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (68, 
    'Tiruvallur', 
    'Government Thiruvallur Medical College Hospital', 
    1, 
    'MCH', 
    'THIRUVALLUR MEDICAL COLLEGE', 
    'Government', 
    15108, 
    33, 
    31);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (69, 
    'Tiruvallur', 
    'Government Taluk Hospital, Tiruthani, Tiruvallur', 
    3, 
    'TK', 
    'TIRUTHANI GH', 
    'Government', 
    10, 
    33, 
    31);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (70, 
    'Tiruvallur', 
    'Govt Taluk Hospital, Ponneri, Tiruvallur', 
    3, 
    'TK', 
    'PONNERI GH', 
    'Government', 
    7, 
    33, 
    31);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (71, 
    'Tiruvannamalai', 
    'Government District Head Quarters Hospital, Cheyyar, Tiruvannamalai', 
    3, 
    'HQRS', 
    'CHEYYAR GH', 
    'Government', 
    37, 
    33, 
    32);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (72, 
    'Tiruvannamalai', 
    'Government Tiruvanamalai Medical College Hospital', 
    1, 
    'MCH', 
    'THIRUVANNAMALAI MEDICALCOLLEGE&HOSPITAL', 
    'Government', 
    15070, 
    33, 
    32);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (73, 
    'Tiruvarur', 
    'Government District Head Quarters Hospital, Mannargudi, Tiruvarur', 
    3, 
    'HQRS', 
    'MANNARKUDI GH', 
    'Government', 
    156, 
    33, 
    33);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (74, 
    'Tiruvarur', 
    'Government Tiruvarur Medical College Hospital', 
    1, 
    'MCH', 
    'TIRUVARUR MEDICAL COLLEGE', 
    'Government', 
    15043, 
    33, 
    33);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (75, 
    'Vellore', 
    'Government Vellore Medical College Hospital', 
    1, 
    'MCH', 
    'VELLORE MEDICALCOLLEGE&HOSPITAL', 
    'Government', 
    15004, 
    33, 
    34);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (76, 
    'Villupuram', 
    'Government Villupuram Medical College Hospital', 
    1, 
    'MCH', 
    'MUNDIYAMBAKKAM MEDICAL COLLEGE', 
    'Government', 
    15004, 
    33, 
    35);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (77, 
    'Villupuram', 
    'Government Taluk Hospital, Tindivanam, Villupuram', 
    3, 
    'TK', 
    'TINDIVANAM GH', 
    'Government', 
    46, 
    33, 
    35);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (78, 
    'Virudhunagar', 
    'Government Viruthunagar Medical College Hospital', 
    1, 
    'MCH', 
    'VIRUDHUNAGAR MEDICAL COLLEGE', 
    'Government', 
    15105, 
    33, 
    36);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (79, 
    'Virudhunagar', 
    'Government Taluk Hospital, Aruppukottai, Virudhunagar', 
    3, 
    'TK', 
    'ARUPPUKOTTAI GH', 
    'Government', 
    215, 
    33, 
    36);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (80, 
    'Virudhunagar', 
    'PACR Government Hospital, Rajapalayam, Virudhunagar', 
    3, 
    'TK', 
    'RAJAPALAYAM GH', 
    'Government', 
    217, 
    33, 
    36);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1211, 
    'Thiruvannamalai', 
    'Government Vandhavasi Hospital', 
    2, 
    'UHP', 
    'VANDAVASI GH', 
    'Government', 
    3637, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1435, 
    'Tiruchirappalli', 
    'Government MUSIRI TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'MUSIRI GH', 
    'Government', 
    121, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1505, 
    'Chennai', 
    'Govt.Peripheral Hospital - Periyar Nagar Chennai', 
    1, 
    'MCH', 
    'PERIYARNAGAR PHERIPHERAL HSPTL', 
    'Government', 
    15022, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1519, 
    'Coimbatore', 
    'Government Medical College and ESI Hospital - Singanallur - Coimbatore', 
    1, 
    'MCH', 
    'ESIHospitalSinganallur UPHC', 
    'Government', 
    15095, 
    33, 
    4);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1521, 
    'Nagapattinam', 
    'Government VEDARANYAM TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'VEDARANYAM GH', 
    'Government', 
    153, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1563, 
    'Pudukottai', 
    'Government THIRUMAYAM TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'THIRUMAYAM GH', 
    'Government', 
    185, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1594, 
    'Theni', 
    'Government UTHAMAPALAYAM TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'UTHAMAPALAYAM GH', 
    'Government', 
    214, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1660, 
    'Salem', 
    'Government VAZHAPADI TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'VALAPADY GH', 
    'Government', 
    288, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1682, 
    'Thiruvannamalai', 
    'Government CHENGAM TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'CHENGAM GH', 
    'Government', 
    36, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1706, 
    'Thanjavur', 
    'Government PATTUKKOTTAI MUNICIPALITY UHP', 
    2, 
    'UHP', 
    'PATTUKOTTAI GH', 
    'Government', 
    53213, 
    NULL, 
    NULL);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1807, 
    'Cuddalore', 
    'Rajah muthiah Medical College, Cuddalore', 
    1, 
    '', 
    'RAJAH MUTHIAH MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    NULL, 
    33, 
    5);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1808, 
    'Chennai', 
    'Institute of Child Health and Hospital for Children', 
    1, 
    'Hospital', 
    'ICH FOR CHILDREN MEDICAL COLLEGE & HOSPITAL', 
    'Government', 
    NULL, 
    33, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1809, 
    'Chengalpattu', 
    'Melmaruvatur Adhiparasakti Institute of Medical Sciences', 
    4, 
    '', 
    'MELMARUVATUR ADHIPARASAKTI INSTITUTE OF MEDICAL SCIENCES', 
    'Private', 
    NULL, 
    33, 
    2);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1810, 
    'Cuddalore', 
    'Government VIRUDHACHALAM TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'VIRUDHACHALAM GH', 
    'Government', 
    141, 
    NULL, 
    5);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1811, 
    'Virudhunagar', 
    'Government SATHUR TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'SATHUR GH', 
    'Government', 
    218, 
    NULL, 
    38);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1812, 
    'Dharmapuri', 
    'Government PALACODE TALUK HOSPITAL', 
    3, 
    'HOSPITAL', 
    'PALACODE GH', 
    'Government', 
    32, 
    NULL, 
    6);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1813, 
    'Sivaganga', 
    'Government Thirupattur Hospital,Sivagangai dt', 
    3, 
    'HOSPITAL', 
    'TIRUPATHUR GH(Sivaganga)', 
    'Government', 
    NULL, 
    NULL, 
    23);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1814, 
    'Chennai', 
    'Government Omandurar Multispeciality Hospital', 
    1, 
    'MCH', 
    'Omandhurar Multi Speciality Hospital', 
    '', 
    NULL, 
    NULL, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1815, 
    'Chennai', 
    'Kalaignar Centenary Super Speciality Hospital KCSSH', 
    1, 
    'MCH', 
    'KALAIGNAR CENTENARY SUPER SPECIALITY HOSPITAL KCSSH', 
    '', 
    NULL, 
    NULL, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1816, 
    'Kancheepuram', 
    'Government Taluk Hospital Wallajabad', 
    1, 
    'MCH', 
    'WALAJABAD GH', 
    '', 
    NULL, 
    NULL, 
    3);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1817, 
    'Theni', 
    'Government Taluk Hospital Cumbum', 
    1, 
    'TK', 
    'CUMBUM GH', 
    '', 
    NULL, 
    NULL, 
    27);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1818, 
    'Pudukottai', 
    'Government Taluk Hospital Karampakudi', 
    1, 
    'TK', 
    'KARAMBAKKUDI GH', 
    '', 
    NULL, 
    NULL, 
    19);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1819, 
    'Pudukottai', 
    'Government Taluk Hospital Keeranur', 
    1, 
    'TK', 
    'KEERANUR GH', 
    '', 
    NULL, 
    NULL, 
    19);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1820, 
    'Thiruvanamalai', 
    'Government Taluk Hospital Polur', 
    1, 
    'TK', 
    'POLUR GH', 
    '', 
    NULL, 
    NULL, 
    35);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1821, 
    'Tiruppur', 
    'Government Taluk Hospital Dharapuram', 
    1, 
    'TK', 
    'DHARAPURAM GH', 
    '', 
    NULL, 
    NULL, 
    33);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1822, 
    'Tiruppur', 
    'Government Taluk Hospital Palladam', 
    1, 
    'TK', 
    'PALLADAM GH', 
    '', 
    NULL, 
    NULL, 
    33);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1823, 
    'Dindugul', 
    'Government Taluk Hospital Oddanchatiram', 
    1, 
    'TK', 
    'ODDANCHATRAM GH', 
    '', 
    NULL, 
    NULL, 
    7);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1824, 
    'Dharmapuri', 
    'Government Taluk Hospital Pappireddipatti', 
    1, 
    'TK', 
    'PAPPIREDIPATTI GH', 
    '', 
    NULL, 
    NULL, 
    6);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1825, 
    'Vellore', 
    'Government Taluk Hospital Gudiyatham', 
    1, 
    'TK', 
    'GUDIYATHAM GH', 
    '', 
    NULL, 
    NULL, 
    36);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1826, 
    'Mayiladuthurai', 
    'Government Taluk Hospital Sirkazi', 
    1, 
    'TK', 
    'SIRKAZHI GH', 
    '', 
    NULL, 
    NULL, 
    15);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1827, 
    'Tiruvallur', 
    'Government Taluk Hospital Nazretpet', 
    1, 
    'TK', 
    '', 
    '', 
    NULL, 
    NULL, 
    34);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1828, 
    'Nilgiri', 
    'Government Taluk Hospital Kothagiri', 
    1, 
    'TK', 
    'KOTHAGIRI GH', 
    '', 
    NULL, 
    NULL, 
    26);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1829, 
    'Villupuram', 
    'Government Taluk Hospital Marakanam', 
    1, 
    'TK', 
    'MARAKKANAM GH', 
    '', 
    NULL, 
    NULL, 
    37);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1830, 
    'Tiruvannamalai', 
    'Government Taluk Hospital, ARANI', 
    1, 
    'TK', 
    'ARANI GH', 
    '', 
    NULL, 
    NULL, 
    35);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1831, 
    'Kancheepuram', 
    'Government Taluk Hospital, UTHIRAMERUR', 
    1, 
    'TK', 
    'UTHIRAMERUR GH', 
    '', 
    NULL, 
    NULL, 
    10);
INSERT INTO lkp_hospitals 
    (HospitalId, DistrictName, HospitalName, MainHospitalType, HospitalType, HospitalName108, Type_of_Hospital, Institution_Code, StateCode, District_Id)
    VALUES 
    (1832, 
    'Virudhunagar', 
    'Government Taluk Hospital, SIVAKASI', 
    1, 
    'TK', 
    'SIVAKASI GH', 
    '', 
    NULL, 
    NULL, 
    38);