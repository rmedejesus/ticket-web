import React, { useEffect, useState } from 'react';
import TicketService from '../services/ticket.service';
import { useNavigate } from 'react-router-dom';
import type { ITicketRequest } from '../types/ticket';
import type { IUser } from '../types/user';
import userService from '../services/user.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackButton from './BackButton';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import TokenService from "../services/token.service";

interface AccommodationType {
  id: number;
  name: string;
  accommodations: AccommodationName[];
}

interface AccommodationName {
  id: number;
  type_id: number;
  name: string;
  rooms: RoomNumber[];
}

interface RoomNumber {
  id: number;
  accommodation_id: number;
  name: string;
  locations: SpecificLocation[];
}

interface SpecificLocation {
  id: number;
  room_id: number;
  name: string;
}

const CreateTicketForm: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);

  const [selectedType, setSelectedType] = useState<AccommodationType | null>(null);
  const [selectedName, setSelectedName] = useState<AccommodationName | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomNumber | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SpecificLocation | null>(null);

  const [availableNames, setAvailableNames] = useState<AccommodationName[]>([]);
  const [availableRooms, setAvailableRooms] = useState<RoomNumber[]>([]);
  const [availableLocations, setAvailableLocations] = useState<SpecificLocation[]>([]);

  const [formData, setFormData] = useState<ITicketRequest>({
    reported_by: '',
    assigned_to: '',
    accommodation_name: '',
    accommodation_room_number: '',
    accommodation_specific_location: '',
    accommodation_type: '',
    request_type: '',
    request_detail: '',
    task_priority: '',
    note: '',
    is_immediate_access: '',
  });

  const accommodationData: AccommodationType[] = [
    {
      id: 1,
      name: 'Guest',
      accommodations: [
        {
          id: 101,
          type_id: 1,
          name: 'Alpine Apartments 2',
          rooms: [
            {
              id: 201, accommodation_id: 101, name: 'A', locations: [
                { id: 301, room_id: 201, name: 'Bathroom' },
                { id: 302, room_id: 201, name: 'Kitchen' },
                { id: 303, room_id: 201, name: 'Living Room' },
                { id: 304, room_id: 201, name: 'Bedroom' },
              ]
            },
            {
              id: 202, accommodation_id: 101, name: 'B', locations: [
                { id: 305, room_id: 202, name: 'Bathroom' },
                { id: 306, room_id: 202, name: 'Kitchen' },
                { id: 307, room_id: 202, name: 'Living Room' },
                { id: 308, room_id: 202, name: 'Bedroom' },
              ]
            },
            {
              id: 203, accommodation_id: 101, name: 'C', locations: [
                { id: 309, room_id: 203, name: 'Bathroom' },
                { id: 310, room_id: 203, name: 'Kitchen' },
                { id: 311, room_id: 203, name: 'Living Room' },
                { id: 312, room_id: 203, name: 'Bedroom' },
                { id: 313, room_id: 203, name: 'Loft' },
              ]
            },
            {
              id: 204, accommodation_id: 101, name: 'D', locations: [
                { id: 314, room_id: 204, name: 'Bathroom' },
                { id: 315, room_id: 204, name: 'Kitchen' },
                { id: 316, room_id: 204, name: 'Living Room' },
                { id: 317, room_id: 204, name: 'Bedroom' },
                { id: 318, room_id: 204, name: 'Loft' },
              ]
            },
            {
              id: 205, accommodation_id: 101, name: 'Common', locations: [
                { id: 319, room_id: 205, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 102,
          type_id: 1,
          name: 'Ezo Yume',
          rooms: [
            {
              id: 206,
              accommodation_id: 102,
              name: 'Main',
              locations: [
                { id: 320, room_id: 206, name: '1F Bedroom' },
                { id: 321, room_id: 206, name: '1F Bathroom' },
                { id: 322, room_id: 206, name: '2F Living Room' },
                { id: 323, room_id: 206, name: '2F Dining Room' },
                { id: 324, room_id: 206, name: '2F Kitchen' },
                { id: 325, room_id: 206, name: '3F Bedroom' },
                { id: 326, room_id: 206, name: '3F Bathroom' },
              ]
            },
          ]
        },
        {
          id: 103,
          type_id: 1,
          name: 'Full Circle',
          rooms: [
            {
              id: 207,
              accommodation_id: 103,
              name: 'A',
              locations: [
                { id: 327, room_id: 207, name: 'Living Room' },
                { id: 328, room_id: 207, name: 'Kitchen' },
                { id: 329, room_id: 207, name: 'Bedroom' },
                { id: 330, room_id: 207, name: 'Bathroom' },
              ]
            },
            {
              id: 208,
              accommodation_id: 103,
              name: 'B',
              locations: [
                { id: 331, room_id: 208, name: '1F Living Room' },
                { id: 332, room_id: 208, name: '1F Kitchen' },
                { id: 333, room_id: 208, name: '1F Dining Room' },
                { id: 334, room_id: 208, name: 'BF Bathroom' },
                { id: 335, room_id: 208, name: 'BF Bedroom' },
              ]
            },
            {
              id: 209,
              accommodation_id: 103,
              name: 'C',
              locations: [
                { id: 336, room_id: 209, name: '1F Living Room' },
                { id: 337, room_id: 209, name: '1F Kitchen' },
                { id: 338, room_id: 209, name: '1F Dining Room' },
                { id: 339, room_id: 209, name: '1F Bathroom' },
                { id: 340, room_id: 209, name: '2F Bedroom' },
                { id: 341, room_id: 209, name: '2F Bathroom' },
              ]
            },
            {
              id: 210,
              accommodation_id: 103,
              name: 'D',
              locations: [
                { id: 342, room_id: 210, name: '1F Kitchen' },
                { id: 343, room_id: 210, name: '1F Living Room' },
                { id: 344, room_id: 210, name: '1F Bathroom' },
                { id: 345, room_id: 210, name: '2F Bedroom' },
                { id: 346, room_id: 210, name: '2F Bathroom' },
              ]
            },
            {
              id: 211,
              accommodation_id: 103,
              name: 'Common',
              locations: [
                { id: 347, room_id: 211, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 104,
          type_id: 1,
          name: 'Haven Niseko',
          rooms: [
            {
              id: 212, accommodation_id: 104, name: '201', locations: [
                { id: 348, room_id: 212, name: 'Bedroom' },
                { id: 349, room_id: 212, name: 'Bathroom' },
                { id: 350, room_id: 212, name: 'Living Room' },
                { id: 351, room_id: 212, name: 'Dining Room' },
                { id: 352, room_id: 212, name: 'Kitchen' },
              ]
            },
            {
              id: 213, accommodation_id: 104, name: '202', locations: [
                { id: 353, room_id: 213, name: 'Bedroom' },
                { id: 354, room_id: 213, name: 'Bathroom' },
              ]
            },
            {
              id: 214, accommodation_id: 104, name: '203', locations: [
                { id: 355, room_id: 214, name: 'Bedroom' },
                { id: 356, room_id: 214, name: 'Bathroom' },
                { id: 357, room_id: 214, name: 'Kitchen' },
              ]
            },
            {
              id: 215, accommodation_id: 104, name: '301', locations: [
                { id: 358, room_id: 215, name: 'Bedroom' },
                { id: 359, room_id: 215, name: 'Bathroom' },
                { id: 360, room_id: 215, name: 'Living Room' },
                { id: 361, room_id: 215, name: 'Hallway' },
                { id: 362, room_id: 215, name: 'Kitchen' },

              ]
            },
            {
              id: 216, accommodation_id: 104, name: '501', locations: [
                { id: 363, room_id: 216, name: 'Bedroom' },
                { id: 364, room_id: 216, name: 'Bathroom' },
                { id: 365, room_id: 216, name: 'Living Room' },
                { id: 366, room_id: 216, name: 'Hallway' },
                { id: 367, room_id: 216, name: 'Kitchen' },
              ]
            },
            {
              id: 217, accommodation_id: 104, name: 'Common', locations: [
                { id: 368, room_id: 217, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 105, type_id: 1, name: 'Kamakura', rooms: [
            {
              id: 218, accommodation_id: 105, name: '1', locations: [
                { id: 369, room_id: 218, name: 'Bedroom' },
                { id: 370, room_id: 218, name: 'Bathroom' },
                { id: 371, room_id: 218, name: 'Living Room' },
                { id: 372, room_id: 218, name: 'Kitchen' },
              ]
            },
            {
              id: 219, accommodation_id: 105, name: '2', locations: [
                { id: 373, room_id: 219, name: 'Bedroom' },
                { id: 374, room_id: 219, name: 'Bathroom' },
                { id: 375, room_id: 219, name: 'Living Room' },
                { id: 376, room_id: 219, name: 'Kitchen' },
              ]
            },
            {
              id: 220, accommodation_id: 105, name: '3', locations: [
                { id: 377, room_id: 220, name: 'Bedroom' },
                { id: 378, room_id: 220, name: 'Bathroom' },
                { id: 379, room_id: 220, name: 'Living Room' },
                { id: 380, room_id: 220, name: 'Kitchen' },
                { id: 381, room_id: 220, name: 'Loft' },
              ]
            },
            {
              id: 221, accommodation_id: 105, name: '4', locations: [
                { id: 382, room_id: 221, name: 'Bedroom' },
                { id: 383, room_id: 221, name: 'Bathroom' },
                { id: 384, room_id: 221, name: 'Living Room' },
                { id: 385, room_id: 221, name: 'Kitchen' },
                { id: 386, room_id: 221, name: 'Loft' },
              ]
            },
            {
              id: 222, accommodation_id: 105, name: 'Common', locations: [
                { id: 387, room_id: 222, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 106, type_id: 1, name: 'Penguin Mura', rooms: [
            {
              id: 223, accommodation_id: 106, name: 'Main', locations: [
                { id: 388, room_id: 223, name: 'BF' },
                { id: 389, room_id: 223, name: '1F' },
                { id: 390, room_id: 223, name: '2F' },
                { id: 391, room_id: 223, name: '3F' },
              ]
            },
          ]
        },
        {
          id: 107, type_id: 1, name: 'Powder Haven', rooms: [
            {
              id: 224, accommodation_id: 107, name: '1', locations: [
                { id: 392, room_id: 224, name: '1F Laundry Room' },
                { id: 393, room_id: 224, name: '2F Toilet' },
                { id: 394, room_id: 224, name: '2F Kitchen' },
                { id: 395, room_id: 224, name: '2F Living Room' },
                { id: 396, room_id: 224, name: '3F Bathroom' },
                { id: 397, room_id: 224, name: '3F Bedroom' },
              ]
            },
            {
              id: 225, accommodation_id: 107, name: '2', locations: [
                { id: 398, room_id: 225, name: '1F Laundry Room' },
                { id: 399, room_id: 225, name: '2F Toilet' },
                { id: 401, room_id: 225, name: '2F Kitchen' },
                { id: 402, room_id: 225, name: '2F Living Room' },
                { id: 403, room_id: 225, name: '3F Bathroom' },
                { id: 404, room_id: 225, name: '3F Bedroom' },
              ]
            },
            {
              id: 226, accommodation_id: 107, name: 'Common', locations: [
                { id: 405, room_id: 226, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 108, type_id: 1, name: 'Shirokuma', rooms: [
            {
              id: 227, accommodation_id: 108, name: '1', locations: [
                { id: 406, room_id: 227, name: 'BF Laundry Room' },
                { id: 407, room_id: 227, name: 'BF Toilet' },
                { id: 408, room_id: 227, name: 'BF Ski Room' },
                { id: 409, room_id: 227, name: 'BF Bedroom' },
                { id: 410, room_id: 227, name: '1F Kitchen' },
                { id: 411, room_id: 227, name: '1F Living Room' },
                { id: 412, room_id: 227, name: '1F Toilet' },
                { id: 413, room_id: 227, name: '2F Toilet' },
                { id: 414, room_id: 227, name: '2F Bathroom' },
                { id: 415, room_id: 227, name: '2F Bedroom' },
              ]
            },
            {
              id: 228, accommodation_id: 108, name: '2', locations: [
                { id: 416, room_id: 228, name: 'BF Laundry Room' },
                { id: 417, room_id: 228, name: 'BF Toilet' },
                { id: 418, room_id: 228, name: 'BF Ski Room' },
                { id: 419, room_id: 228, name: 'BF Shower Room' },
                { id: 419, room_id: 228, name: 'BF Boiler Room' },
                { id: 420, room_id: 228, name: '1F Kitchen' },
                { id: 421, room_id: 228, name: '1F Living Room' },
                { id: 422, room_id: 228, name: '1F Toilet' },
                { id: 423, room_id: 228, name: '2F Toilet' },
                { id: 424, room_id: 228, name: '2F Bathroom' },
                { id: 425, room_id: 228, name: '2F Bedroom' },
              ]
            },
          ]
        },
        {
          id: 109, type_id: 1, name: 'Shinka', rooms: [
            {
              id: 229, accommodation_id: 109, name: '201', locations: [
                { id: 426, room_id: 229, name: 'Living Room' },
                { id: 427, room_id: 229, name: 'Kitchen' },
                { id: 428, room_id: 229, name: 'Bathroom' },
                { id: 429, room_id: 229, name: 'Bedroom' },]
            },
            {
              id: 230, accommodation_id: 109, name: '202', locations: [
                { id: 430, room_id: 230, name: 'Living Room' },
                { id: 431, room_id: 230, name: 'Kitchen' },
                { id: 432, room_id: 230, name: 'Bathroom' },
              ]
            },
            {
              id: 231, accommodation_id: 109, name: '203', locations: [
                { id: 433, room_id: 231, name: 'Living Room' },
                { id: 434, room_id: 231, name: 'Kitchen' },
                { id: 435, room_id: 231, name: 'Bathroom' },
              ]
            },
            {
              id: 232, accommodation_id: 109, name: '204', locations: [
                { id: 436, room_id: 232, name: 'Living Room' },
                { id: 437, room_id: 232, name: 'Kitchen' },
                { id: 438, room_id: 232, name: 'Bathroom' },
              ]
            },
            {
              id: 233, accommodation_id: 109, name: '205', locations: [
                { id: 439, room_id: 233, name: 'Living Room' },
                { id: 440, room_id: 233, name: 'Kitchen' },
                { id: 441, room_id: 233, name: 'Bathroom' },
              ]
            },
            {
              id: 234, accommodation_id: 109, name: '206', locations: [
                { id: 442, room_id: 234, name: 'Living Room' },
                { id: 443, room_id: 234, name: 'Kitchen' },
                { id: 444, room_id: 234, name: 'Bathroom' },
                { id: 445, room_id: 234, name: 'Bedroom' },
              ]
            },
            {
              id: 235, accommodation_id: 109, name: '301', locations: [
                { id: 446, room_id: 235, name: 'Living Room' },
                { id: 447, room_id: 235, name: 'Kitchen' },
                { id: 448, room_id: 235, name: 'Bathroom' },
                { id: 449, room_id: 235, name: 'Bedroom' },
              ]
            },
            {
              id: 236, accommodation_id: 109, name: '302', locations: [
                { id: 450, room_id: 236, name: 'Living Room' },
                { id: 451, room_id: 236, name: 'Kitchen' },
                { id: 452, room_id: 236, name: 'Bathroom' },
              ]
            },
            {
              id: 237, accommodation_id: 109, name: '303', locations: [
                { id: 453, room_id: 237, name: 'Living Room' },
                { id: 454, room_id: 237, name: 'Kitchen' },
                { id: 455, room_id: 237, name: 'Bathroom' },
              ]
            },
            {
              id: 238, accommodation_id: 109, name: '304', locations: [
                { id: 456, room_id: 238, name: 'Living Room' },
                { id: 457, room_id: 238, name: 'Kitchen' },
                { id: 458, room_id: 238, name: 'Bathroom' },
              ]
            },
            {
              id: 239, accommodation_id: 109, name: '305', locations: [
                { id: 459, room_id: 239, name: 'Living Room' },
                { id: 460, room_id: 239, name: 'Kitchen' },
                { id: 461, room_id: 239, name: 'Bathroom' },
              ]
            },
            {
              id: 240, accommodation_id: 109, name: '306', locations: [
                { id: 462, room_id: 240, name: 'Living Room' },
                { id: 463, room_id: 240, name: 'Kitchen' },
                { id: 464, room_id: 240, name: 'Bathroom' },
                { id: 465, room_id: 240, name: 'Bedroom' },
              ]
            },
            {
              id: 241, accommodation_id: 109, name: '401', locations: [
                { id: 466, room_id: 241, name: 'Living Room' },
                { id: 467, room_id: 241, name: 'Kitchen' },
                { id: 468, room_id: 241, name: 'Bathroom' },
                { id: 469, room_id: 241, name: 'Bedroom' },
              ]
            },
            {
              id: 242, accommodation_id: 109, name: '402', locations: [
                { id: 470, room_id: 242, name: 'Living Room' },
                { id: 471, room_id: 242, name: 'Kitchen' },
                { id: 472, room_id: 242, name: 'Bathroom' },
                { id: 473, room_id: 242, name: 'Bedroom' },
              ]
            },
            {
              id: 243, accommodation_id: 109, name: 'Common', locations: [
                { id: 474, room_id: 243, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 110, type_id: 1, name: 'Snow Fox', rooms: [
            {
              id: 244, accommodation_id: 110, name: 'Main', locations: [
                { id: 475, room_id: 244, name: '1F Living Room' },
                { id: 476, room_id: 244, name: '1F Kitchen' },
                { id: 477, room_id: 244, name: '1F Bathroom' },
                { id: 478, room_id: 244, name: '1F Laundry Room' },
                { id: 479, room_id: 244, name: '2F Bathroom' },
                { id: 480, room_id: 244, name: '2F Bedroom' },
              ]
            },
          ]
        },
        {
          id: 111, type_id: 1, name: 'Itoku', rooms: [
            {
              id: 245, accommodation_id: 111, name: '1', locations: [
                { id: 481, room_id: 245, name: 'BF Toilet' },
                { id: 482, room_id: 245, name: 'BF Boiler Room' },
                { id: 483, room_id: 245, name: 'BF Ski Room' },
                { id: 484, room_id: 245, name: 'BF Laundry Room' },
                { id: 485, room_id: 245, name: 'BF Bedroom' },
                { id: 486, room_id: 245, name: '1F Toilet' },
                { id: 487, room_id: 245, name: '1F Living Room' },
                { id: 488, room_id: 245, name: '1F Kitchen' },
                { id: 489, room_id: 245, name: '2F Bedroom' },
                { id: 490, room_id: 245, name: '1F Toilet' },
                { id: 491, room_id: 245, name: '2F Bathroom' },
              ]
            },
            {
              id: 246, accommodation_id: 111, name: '2', locations: [
                { id: 492, room_id: 246, name: 'BF Toilet' },
                { id: 493, room_id: 246, name: 'BF Boiler Room' },
                { id: 494, room_id: 246, name: 'BF Ski Room' },
                { id: 495, room_id: 246, name: 'BF Laundry Room' },
                { id: 496, room_id: 246, name: 'BF Bedroom' },
                { id: 497, room_id: 246, name: '1F Toilet' },
                { id: 498, room_id: 246, name: '1F Living Room' },
                { id: 499, room_id: 246, name: '1F Kitchen' },
                { id: 500, room_id: 246, name: '2F Bedroom' },
                { id: 501, room_id: 246, name: '2F Bathroom' },
              ]
            },
          ]
        },
        {
          id: 112, type_id: 1, name: 'Tamo', rooms: [
            {
              id: 247, accommodation_id: 112, name: 'Main', locations: [
                { id: 502, room_id: 247, name: '1F Ski Room' },
                { id: 503, room_id: 247, name: '1F Bathroom' },
                { id: 504, room_id: 247, name: '1F Bedroom' },
                { id: 505, room_id: 247, name: '2F Toilet' },
                { id: 506, room_id: 247, name: '2F Living Room' },
                { id: 507, room_id: 247, name: '2F Kitchen' },
                { id: 508, room_id: 247, name: '3F Bedroom' },
                { id: 509, room_id: 247, name: '3F Bathroom' },
              ]
            },
          ]
        },
        {
          id: 113, type_id: 1, name: 'Toshokan', rooms: [
            {
              id: 248, accommodation_id: 113, name: '1', locations: [
                { id: 510, room_id: 248, name: 'BF Bathroom' },
                { id: 511, room_id: 248, name: 'BF Boiler Room' },
                { id: 512, room_id: 248, name: 'BF Ski Room' },
                { id: 513, room_id: 248, name: 'BF Laundry Room' },
                { id: 514, room_id: 248, name: 'BF Bedroom' },
                { id: 515, room_id: 248, name: '1F Toilet' },
                { id: 516, room_id: 248, name: '1F Living Room' },
                { id: 517, room_id: 248, name: '1F Kitchen' },
                { id: 518, room_id: 248, name: '2F Bedroom' },
                { id: 519, room_id: 248, name: '2F Bathroom' },
                { id: 520, room_id: 248, name: '2F Toilet' },
              ]
            },
            {
              id: 249, accommodation_id: 113, name: '2', locations: [
                { id: 521, room_id: 249, name: 'BF Bathroom' },
                { id: 522, room_id: 249, name: 'BF Boiler Room' },
                { id: 523, room_id: 249, name: 'BF Ski Room' },
                { id: 524, room_id: 249, name: 'BF Laundry Room' },
                { id: 525, room_id: 249, name: 'BF Bedroom' },
                { id: 526, room_id: 249, name: '1F Toilet' },
                { id: 527, room_id: 249, name: '1F Living Room' },
                { id: 528, room_id: 249, name: '1F Kitchen' },
                { id: 529, room_id: 249, name: '2F Bedroom' },
                { id: 530, room_id: 249, name: '2F Bathroom' },
                { id: 531, room_id: 249, name: '2F Toilet' },
              ]
            },
          ]
        },
        {
          id: 114, type_id: 1, name: 'Tudibaring', rooms: [
            {
              id: 250, accommodation_id: 114, name: 'Main', locations: [
                { id: 532, room_id: 250, name: '1F Garage' },
                { id: 533, room_id: 250, name: '1F Bedroom' },
                { id: 534, room_id: 250, name: '1F Bathroom' },
                { id: 535, room_id: 250, name: '2F Kitchen' },
                { id: 536, room_id: 250, name: '2F Bedroom' },
                { id: 537, room_id: 250, name: '2F Bathroom' },
                { id: 538, room_id: 250, name: '2F Living Room' },
              ]
            },
          ]
        },
        {
          id: 115, type_id: 1, name: 'Yukisawa', rooms: [
            {
              id: 251, accommodation_id: 115, name: 'Main', locations: [
                { id: 539, room_id: 251, name: '1F Garage' },
                { id: 540, room_id: 251, name: '1F Bedroom' },
                { id: 541, room_id: 251, name: '1F Bathroom' },
                { id: 542, room_id: 251, name: '1F Ski Room' },
                { id: 543, room_id: 251, name: '2F Living Room' },
                { id: 544, room_id: 251, name: '2F Kitchen' },
                { id: 545, room_id: 251, name: '2F Toilet' },
                { id: 546, room_id: 251, name: '3F Bathroom' },
                { id: 547, room_id: 251, name: '3F Bedroom' },
              ]
            },
          ]
        },
        {
          id: 116, type_id: 1, name: 'Yuki Yama', rooms: [
            {
              id: 252, accommodation_id: 116, name: '1', locations: [
                { id: 548, room_id: 252, name: 'BF Bathroom' },
                { id: 549, room_id: 252, name: 'BF Bedroom' },
                { id: 550, room_id: 252, name: '1F Kitchen' },
                { id: 551, room_id: 252, name: '1F Living Room' },
                { id: 552, room_id: 252, name: '1F Bathroom' },
                { id: 553, room_id: 252, name: '1F Bedroom' },
              ]
            },
            {
              id: 253, accommodation_id: 116, name: '2', locations: [
                { id: 554, room_id: 253, name: 'BF Bathroom' },
                { id: 555, room_id: 253, name: 'BF Bedroom' },
                { id: 556, room_id: 253, name: '1F Living Room' },
                { id: 557, room_id: 253, name: '1F Kitchen' },
              ]
            },
            {
              id: 254, accommodation_id: 116, name: '3', locations: [
                { id: 558, room_id: 254, name: 'BF Bedroom' },
                { id: 559, room_id: 254, name: 'BF Bathroom' },
                { id: 560, room_id: 254, name: '1F Living Room' },
                { id: 561, room_id: 254, name: '1F Bathroom' },
                { id: 562, room_id: 254, name: '1F Bedroom' },
                { id: 563, room_id: 254, name: '1F Kitchen' },
              ]
            },
            {
              id: 255, accommodation_id: 116, name: '4', locations: [
                { id: 564, room_id: 255, name: 'Bedroom' },
                { id: 565, room_id: 255, name: 'Bathroom' },
                { id: 566, room_id: 255, name: 'Living Room' },
                { id: 567, room_id: 255, name: 'Kitchen' },
              ]
            },
            {
              id: 256, accommodation_id: 116, name: '5', locations: [
                { id: 568, room_id: 256, name: 'Bedroom' },
                { id: 569, room_id: 256, name: 'Bathroom' },
                { id: 570, room_id: 256, name: 'Living Room' },
                { id: 571, room_id: 256, name: 'Kitchen' },
              ]
            },
            {
              id: 257, accommodation_id: 116, name: 'Common', locations: [
                { id: 579, room_id: 257, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 117, type_id: 1, name: 'Yume Basho', rooms: [
            {
              id: 258, accommodation_id: 117, name: 'Main', locations: [
                { id: 572, room_id: 258, name: '1F Garage' },
                { id: 573, room_id: 258, name: '1F Laundry Room' },
                { id: 574, room_id: 258, name: '1F Toilet' },
                { id: 575, room_id: 258, name: '1F Kitchen' },
                { id: 576, room_id: 258, name: '1F Living Room' },
                { id: 577, room_id: 258, name: '2F Bedroom' },
                { id: 578, room_id: 258, name: '2F Bathroom' },
              ]
            },
          ]
        },
        {
          id: 118, type_id: 1, name: 'Yume House', rooms: [
            {
              id: 259, accommodation_id: 118, name: 'Main', locations: [
                { id: 580, room_id: 259, name: 'Bedroom' },
                { id: 581, room_id: 259, name: 'Bathroom' },
                { id: 582, room_id: 259, name: 'Living Room' },
                { id: 583, room_id: 259, name: 'Kitchen' },
              ]
            },
          ]
        },
        {
          id: 119, type_id: 1, name: 'Yotei Cottage', rooms: [
            {
              id: 260, accommodation_id: 119, name: 'Main', locations: [
                { id: 584, room_id: 260, name: '1F Living Room' },
                { id: 585, room_id: 260, name: '1F Kitchen' },
                { id: 586, room_id: 260, name: '2F  Bedroom' },
                { id: 587, room_id: 260, name: '2F Bathroom' },
                { id: 588, room_id: 260, name: 'Loft Bedroom' },
              ]
            },
          ]
        },
      ],
    },
    {
      id: 2, name: 'Staff', accommodations: [
        {
          id: 120, type_id: 2, name: 'Lucky Apartment', rooms: [
            {
              id: 261, accommodation_id: 120, name: 'A1', locations: [
                { id: 589, room_id: 261, name: 'Living Room' },
                { id: 590, room_id: 261, name: 'Kitchen' },
                { id: 591, room_id: 261, name: 'Bedroom' },
                { id: 592, room_id: 261, name: 'Shower Room' },
              ]
            },
            {
              id: 262, accommodation_id: 120, name: 'A2', locations: [
                { id: 593, room_id: 262, name: 'Living Room' },
                { id: 594, room_id: 262, name: 'Kitchen' },
                { id: 595, room_id: 262, name: 'Bedroom' },
                { id: 596, room_id: 262, name: 'Shower Room' },
              ]
            },
            {
              id: 263, accommodation_id: 120, name: 'A3', locations: [
                { id: 597, room_id: 263, name: 'Living Room' },
                { id: 598, room_id: 263, name: 'Kitchen' },
                { id: 599, room_id: 263, name: 'Bedroom' },
                { id: 600, room_id: 263, name: 'Shower Room' },
              ]
            },
            {
              id: 264, accommodation_id: 120, name: 'A4', locations: [
                { id: 601, room_id: 264, name: 'Living Room' },
                { id: 602, room_id: 264, name: 'Kitchen' },
                { id: 603, room_id: 264, name: 'Bedroom' },
                { id: 604, room_id: 264, name: 'Shower Room' },
              ]
            },
            {
              id: 265, accommodation_id: 120, name: 'A5', locations: [
                { id: 605, room_id: 265, name: 'Living Room' },
                { id: 606, room_id: 265, name: 'Kitchen' },
                { id: 607, room_id: 265, name: 'Bedroom' },
                { id: 608, room_id: 265, name: 'Shower Room' },
              ]
            },
            {
              id: 266, accommodation_id: 120, name: 'A6', locations: [
                { id: 609, room_id: 266, name: 'Living Room' },
                { id: 610, room_id: 266, name: 'Kitchen' },
                { id: 611, room_id: 266, name: 'Bedroom' },
                { id: 612, room_id: 266, name: 'Shower Room' },
              ]
            },
            {
              id: 267, accommodation_id: 120, name: 'A7', locations: [
                { id: 613, room_id: 267, name: 'Living Room' },
                { id: 614, room_id: 267, name: 'Kitchen' },
                { id: 615, room_id: 267, name: 'Bedroom' },
                { id: 616, room_id: 267, name: 'Shower Room' },
              ]
            },
            {
              id: 268, accommodation_id: 120, name: 'B1', locations: [
                { id: 617, room_id: 268, name: 'Living Room' },
                { id: 618, room_id: 268, name: 'Kitchen' },
                { id: 619, room_id: 268, name: 'Bedroom' },
                { id: 620, room_id: 268, name: 'Shower Room' },
              ]
            },
            {
              id: 269, accommodation_id: 120, name: 'B2', locations: [
                { id: 621, room_id: 269, name: 'Living Room' },
                { id: 622, room_id: 269, name: 'Kitchen' },
                { id: 623, room_id: 269, name: 'Bedroom' },
                { id: 624, room_id: 269, name: 'Shower Room' },
              ]
            },
            {
              id: 270, accommodation_id: 120, name: 'B3', locations: [
                { id: 625, room_id: 270, name: 'Living Room' },
                { id: 626, room_id: 270, name: 'Kitchen' },
                { id: 627, room_id: 270, name: 'Bedroom' },
                { id: 628, room_id: 270, name: 'Shower Room' },
              ]
            },
            {
              id: 271, accommodation_id: 120, name: 'B4', locations: [
                { id: 629, room_id: 271, name: 'Living Room' },
                { id: 630, room_id: 271, name: 'Kitchen' },
                { id: 631, room_id: 271, name: 'Bedroom' },
                { id: 632, room_id: 271, name: 'Shower Room' },
              ]
            },
            {
              id: 272, accommodation_id: 120, name: 'B5', locations: [
                { id: 633, room_id: 272, name: 'Living Room' },
                { id: 634, room_id: 272, name: 'Kitchen' },
                { id: 635, room_id: 272, name: 'Bedroom' },
                { id: 636, room_id: 272, name: 'Shower Room' },
              ]
            },
            {
              id: 273, accommodation_id: 120, name: 'B6', locations: [
                { id: 637, room_id: 273, name: 'Living Room' },
                { id: 638, room_id: 273, name: 'Kitchen' },
                { id: 639, room_id: 273, name: 'Bedroom' },
                { id: 640, room_id: 273, name: 'Shower Room' },
              ]
            },
            {
              id: 274, accommodation_id: 120, name: 'B7', locations: [
                { id: 641, room_id: 274, name: 'Living Room' },
                { id: 642, room_id: 274, name: 'Kitchen' },
                { id: 643, room_id: 274, name: 'Bedroom' },
                { id: 644, room_id: 274, name: 'Shower Room' },
              ]
            },
          ]
        },
        {
          id: 121, type_id: 2, name: 'Orion', rooms: [
            {
              id: 275, accommodation_id: 121, name: 'Main', locations: [
                { id: 645, room_id: 275, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 122, type_id: 2, name: 'Echo', rooms: [
            {
              id: 276, accommodation_id: 122, name: '1', locations: [{ id: 646, room_id: 276, name: 'Living Room' },
              { id: 647, room_id: 276, name: 'Kitchen' },
              { id: 648, room_id: 276, name: 'Bedroom' },
              { id: 649, room_id: 276, name: 'Shower Room' },]
            },
            {
              id: 277, accommodation_id: 122, name: '2', locations: [{ id: 650, room_id: 277, name: 'Living Room' },
              { id: 651, room_id: 277, name: 'Kitchen' },
              { id: 652, room_id: 277, name: 'Bedroom' },
              { id: 653, room_id: 277, name: 'Shower Room' },]
            },
            {
              id: 278, accommodation_id: 122, name: '3', locations: [{ id: 654, room_id: 278, name: 'Living Room' },
              { id: 655, room_id: 278, name: 'Kitchen' },
              { id: 656, room_id: 278, name: 'Bedroom' },
              { id: 657, room_id: 278, name: 'Shower Room' },]
            },
            {
              id: 279, accommodation_id: 122, name: '4', locations: [{ id: 658, room_id: 279, name: 'Living Room' },
              { id: 659, room_id: 279, name: 'Kitchen' },
              { id: 660, room_id: 279, name: 'Bedroom' },
              { id: 661, room_id: 279, name: 'Shower Room' },]
            },
            {
              id: 280, accommodation_id: 122, name: '5', locations: [{ id: 662, room_id: 280, name: 'Living Room' },
              { id: 663, room_id: 280, name: 'Kitchen' },
              { id: 664, room_id: 280, name: 'Bedroom' },
              { id: 665, room_id: 280, name: 'Shower Room' },]
            },
            {
              id: 281, accommodation_id: 122, name: '6', locations: [{ id: 666, room_id: 281, name: 'Living Room' },
              { id: 667, room_id: 281, name: 'Kitchen' },
              { id: 668, room_id: 281, name: 'Bedroom' },
              { id: 669, room_id: 281, name: 'Shower Room' },]
            },
          ]
        },
        {
          id: 123, type_id: 2, name: 'Yellow House', rooms: [
            {
              id: 282, accommodation_id: 123, name: 'Main', locations: [
                { id: 670, room_id: 282, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 124, type_id: 2, name: 'Daichi', rooms: [
            {
              id: 283, accommodation_id: 124, name: 'Main', locations: [
                { id: 671, room_id: 283, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 125, type_id: 2, name: 'Lock Smith', rooms: [
            {
              id: 284, accommodation_id: 125, name: 'Main', locations: [
                { id: 672, room_id: 284, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 126, type_id: 2, name: 'Walnuts', rooms: [
            {
              id: 285, accommodation_id: 126, name: 'Main', locations: [
                { id: 673, room_id: 285, name: 'Living Room' },
                { id: 674, room_id: 285, name: 'Kitchen' },
                { id: 675, room_id: 285, name: 'Bedroom' },
                { id: 676, room_id: 285, name: 'Bathroom' },
              ]
            },
          ]
        },
        {
          id: 127, type_id: 2, name: 'Iwahara', rooms: [
            {
              id: 286, accommodation_id: 127, name: 'Main', locations: [
                { id: 677, room_id: 286, name: 'Other' },
              ]
            },
          ]
        },
        {
          id: 128, type_id: 2, name: 'SJHQ', rooms: [
            {
              id: 287, accommodation_id: 128, name: 'Main', locations: [
                { id: 678, room_id: 287, name: 'BF' },
                { id: 679, room_id: 287, name: '1F' },
                { id: 680, room_id: 287, name: '2F' },
              ]
            },
          ]
        },
        {
          id: 129, type_id: 2, name: 'NBS', rooms: [
            {
              id: 288, accommodation_id: 129, name: 'Main', locations: [
                { id: 681, room_id: 288, name: 'NBS' },
              ]
            },
          ]
        },
        {
          id: 130, type_id: 2, name: 'NB2', rooms: [
            {
              id: 289, accommodation_id: 130, name: 'Main', locations: [
                { id: 682, room_id: 289, name: '1F Locker Room' },
                { id: 683, room_id: 289, name: '1F Storage' },
                { id: 684, room_id: 289, name: '2F Staff Room' },
              ]
            },
          ]
        },
      ]
    },
  ];

  useEffect(() => {
    userService.getUsers().then(
      (response) => {
        setUsers(response.data.users);
      },
      (error) => {
        const _content = error.response.data.error;

        setMessage(_content);
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "accommodation_type") {
      if (value === "Staff") {
        setIsDropdownDisabled(true);
        formData.assigned_to = "iNciDWxoTHOEP38MnZIy";
      }
      
      if (value === "Guest") {
        setIsDropdownDisabled(false);
      }
      
      const accommodation = accommodationData.find((c) => c.name === value);
      setSelectedType(accommodation || null);
    }

    if (name === "accommodation_name") {
      const acc_name = availableNames.find((c) => c.name === value);
      setSelectedName(acc_name || null);
    }

    if (name === "accommodation_room_number") {
      const room = availableRooms.find((c) => c.name === value);
      setSelectedRoom(room || null);
    }

    if (name === "accommodation_specific_location") {
      const location = availableLocations.find((c) => c.name === value);
      setSelectedLocation(location || null);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Effect to update available states when country changes
  useEffect(() => {
    if (selectedType) {
      setAvailableNames(selectedType.accommodations);
      setSelectedName(null); // Reset state and city when country changes
      setSelectedRoom(null);
      setSelectedLocation(null);
    } else {
      setAvailableNames([]);
      setSelectedName(null);
      setSelectedRoom(null);
      setSelectedLocation(null);
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedName) {
      setAvailableRooms(selectedName.rooms);
      setSelectedRoom(null);
      setSelectedLocation(null);
    } else {
      setAvailableRooms([]);
      setSelectedRoom(null);
      setSelectedLocation(null);
    }
  }, [selectedName]);

  useEffect(() => {
    if (selectedRoom) {
      setAvailableLocations(selectedRoom.locations);
      setSelectedLocation(null);
    } else {
      setAvailableLocations([]);
      setSelectedLocation(null);
    }
  }, [selectedRoom]);

  const navigate = useNavigate();

  const user = TokenService.getUser();

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    formData.reported_by = user.email;
    debugger;
    await TicketService.createTicket(formData).then(
      () => {
        setLoading(false);
        alert("Ticket created successfully.");
        navigate('/dashboard');
      },
      (error) => {

        setLoading(false);
        const resMessage = error.response.data.error;
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="main-container">
      <div className="w-75 text-start"><BackButton /></div>
      <Form className="form-container w-100" onSubmit={handleSubmitForm}>
        <div className="d-flex gap-4 w-75 form-div flex-column mb-3">
          <div>
            <h4 className="mt-4 mb-4 text-start"><strong>Basic Information</strong></h4>
            <div className="w-100 d-flex flex-row gap-5 mb-2 form-layout">
              <Form.Group className="mb-3 w-50">
                <Form.Label htmlFor="reported_by">Assigned By: </Form.Label>
                <Form.Control disabled readOnly id="reported_by" type="text" name="reported_by" value={user.first_name + " " + user.last_name} />
              </Form.Group>
              <Form.Group className="mb-3 w-50">
                <Form.Label htmlFor="assigned_to">Assigned To: </Form.Label>
                <Form.Select required id="assigned_to" name="assigned_to" value={formData.assigned_to} onChange={handleChange} disabled={isDropdownDisabled}>
                  <option value="">Select an option</option>
                  {users?.filter((u) => u.id !== "46T2U1qcT3KVGmhkOYzq" && u.id !== "5XCQaqFvqjLk34jfw4VF" && u.id !== "BQF8TWCzQyBNEIKWOLL9" && u.id !== "HXMidxnxozPkc0Q1QgNU" && u.id !== "XpR1wfY0lJ133YSDFOWC").map((user) => (
                    <option key={user.email} value={user.id}>
                      {user.first_name + " " + user.last_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 w-50">
                <Form.Label htmlFor="request_type">Request Type: </Form.Label>
                <Form.Select required id="request_type" name="request_type" value={formData.request_type} onChange={handleChange}>
                  <option value="">Select an option</option> {/* Optional: default empty option */}
                  <option key="0" value="Cleaning">Cleaning</option>
                  <option key="1" value="Maintenance">Maintenance</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 w-50">
                <Form.Label htmlFor="task_priority">Priority: </Form.Label>
                <Form.Select required id="task_priority" name="task_priority" value={formData.task_priority} onChange={handleChange}>
                  <option value="">Select an option</option> {/* Optional: default empty option */}
                  <option key="0" value="Low">Low</option>
                  <option key="1" value="Medium">Medium</option>
                  <option key="2" value="High">High</option>
                  <option key="3" value="Urgent">Urgent</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <div>
            <h4 className="mt-2 mb-4 text-start"><strong>Accommodation Information</strong></h4>
            <div className="w-100 d-flex flex-row gap-3 form-layout">
              <Form.Group className="mb-3 w-25">
                <Form.Label htmlFor="accommodation_type">Accommodation Type: </Form.Label>
                <Form.Select required id="accommodation_type" name="accommodation_type" value={selectedType?.name} onChange={handleChange}>
                  <option value="">Select an option</option> {/* Optional: default empty option */}
                  {accommodationData.map((acc) => (
                    <option key={acc.id} value={acc.name}>
                      {acc.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 w-25">
                <Form.Label htmlFor="accommodation_name">Accommodation Name: </Form.Label>
                <Form.Select required id="accommodation_name" name="accommodation_name" value={selectedName?.name} onChange={handleChange}>
                  <option value="">Select an option</option> {/* Optional: default empty option */}
                  {availableNames.map((acc) => (
                    <option key={acc.id} value={acc.name}>
                      {acc.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 w-25">
                <Form.Label htmlFor="accommodation_room_number">Room Number: </Form.Label>
                <Form.Select required id="accommodation_room_number" name="accommodation_room_number" value={selectedRoom?.name} onChange={handleChange}>
                  <option value="">Select an option</option> {/* Optional: default empty option */}
                  {availableRooms.map((acc) => (
                    <option key={acc.id} value={acc.name}>
                      {acc.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 w-25">
                <Form.Label htmlFor="accommodation_specific_location">Specific Location: </Form.Label>
                <Form.Select required id="accommodation_specific_location" name="accommodation_specific_location" value={selectedLocation?.name} onChange={handleChange}>
                  <option value="">Select an option</option> {/* Optional: default empty option */}
                  {availableLocations.map((acc) => (
                    <option key={acc.id} value={acc.name}>
                      {acc.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 w-25">
                <Form.Label htmlFor="is_immediate_access">Has Immediate Access?: </Form.Label>
                <Form.Select required id="is_immediate_access" name="is_immediate_access" value={formData.is_immediate_access} onChange={handleChange}>
                  <option value="">Select an option</option> {/* Optional: default empty option */}
                  <option key="0" value="true">Yes</option>
                  <option key="1" value="false">No</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <div className="w-100">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="request_detail">Details: </Form.Label>
              <Form.Control required id="request_detail" as="textarea" name="request_detail" placeholder="Details:" value={formData.request_detail} onChange={handleChange} rows={3} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="note">Notes: </Form.Label>
              <Form.Control id="note" as="textarea" name="note" placeholder="Notes:" value={formData.note} onChange={handleChange} rows={3} />
            </Form.Group>
          </div>
        </div>
        {message !== "" && <p id="error-message">{message}</p>}
        <Button type="submit" disabled={loading}><span className="mr-5 mb-5">Create Ticket</span></Button>
      </Form>
      {loading && (
        <div id="loadingOverlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>)}
    </div>
  );
};

export default CreateTicketForm;