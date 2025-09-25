import React, { useEffect, useState } from 'react';
import TicketService from '../services/ticket.service';
import { useNavigate, useParams } from 'react-router-dom';
import type { ITicketRequest } from '../types/ticket';
import type { IUser } from '../types/user';
import userService from '../services/user.service';
import { Button, Form } from 'react-bootstrap';
import BackButton from './BackButton';

const UpdateTicketForm: React.FC = () => {
  //const [content, setContent] = useState<ITicket>();
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ITicketRequest>({
    reported_by: '',
    assigned_to: '',
    accommodation_name: '',
    accommodation_room_number: '0',
    accommodation_specific_location: '',
    accommodation_type: '',
    request_type: '',
    request_detail: '',
    task_priority: '',
    note: '',
    //image: new Uint8Array([0, 0, 0, 0]),
  });

  const { id } = useParams();
  if (id === undefined) {
    // Handle the case where id is missing, e.g., redirect or show an error
    return <div>Error: ID not found</div>;
  }

  useEffect(() => {
    TicketService.getTicket(id).then(
      (response) => {
        setFormData({
          reported_by: response.data.reported_by || '',
          assigned_to: response.data.assigned_to.toString() || '',
          accommodation_name: response.data.accommodation_name || '',
          accommodation_room_number: response.data.accommodation_room_number || '0',
          accommodation_specific_location: response.data.accommodation_specific_location || '',
          accommodation_type: response.data.accommodation_type || '',
          request_type: response.data.request_type || '',
          request_detail: response.data.request_detail || '',
          task_priority: response.data.task_priority || '',
          note: response.data.note || '',
        });
      },
      (error) => {
        const _content = error.response.data.error;

        setMessage(_content);
      }
    );
  }, []);

  useEffect(() => {
    userService.getUsers().then(
      (response) => {
        setUsers(response.data);
      },
      (error) => {
        const _content = error.response.data.error;

        setMessage(_content);
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await TicketService.updateTicket(id, formData).then(
      () => {
        setLoading(false);
        alert("Ticket updated successfully.");
        navigate('/');
      },
      (error) => {
        const resMessage = error.response.data.error;
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="main-container">
      <div><BackButton /></div>
      <Form className="form-container w-100" onSubmit={handleSubmitForm}>
        <div className="d-flex gap-4 w-50 form-div">
          <div className="w-100">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="reported_by">Assigned By: </Form.Label>
              <Form.Control id="reported_by" type="text" name="reported_by" placeholder="Assigned By:" value={formData.reported_by} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="assigned_to">Assigned To: </Form.Label>
              <Form.Select id="assigned_to" name="assigned_to" value={formData.assigned_to} onChange={handleChange}>
                <option value="">Select an option</option>
                {users?.map((user) => (
                  <option key={user.email} value={user.id}>
                    {user.first_name + " " + user.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="accommodation_name">Accommodation Name: </Form.Label>
              <Form.Select id="accommodation_name" name="accommodation_name" value={formData.accommodation_name} onChange={handleChange}>
                <option value="0">Select an option</option> {/* Optional: default empty option */}
                <option key="1" value="Shinka Niseko">Shinka Niseko</option>
                <option key="2" value="Ezo Yume">Ezo Yume</option>
                <option key="3" value="Powder Haven">Powder Haven</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="accommodation_room_number">Room Number: </Form.Label>
              <Form.Select id="accommodation_room_number" name="accommodation_room_number" value={formData.accommodation_room_number} onChange={handleChange}>
                <option value="0">Select an option</option> {/* Optional: default empty option */}
                <option key="1" value="301">301</option>
                <option key="2" value="402">402</option>
                <option key="3" value="203">203</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="accommodation_specific_location">Specific Location: </Form.Label>
              <Form.Select id="accommodation_specific_location" name="accommodation_specific_location" value={formData.accommodation_specific_location} onChange={handleChange}>
                <option value="">Select an option</option> {/* Optional: default empty option */}
                <option key="0" value="Lower Bathroom">Lower Bathroom</option>
                <option key="1" value="Upper Bathroom">Upper Bathroom</option>
                <option key="2" value="Guest Room">Guest Room</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="w-100">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="accommodation_type">Accommodation Type: </Form.Label>
              <Form.Select id="accommodation_type" name="accommodation_type" value={formData.accommodation_type} onChange={handleChange}>
                <option value="">Select an option</option> {/* Optional: default empty option */}
                <option key="0" value="Guest">Guest</option>
                <option key="1" value="Staff">Staff</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="request_type">Request Type: </Form.Label>
              <Form.Select id="request_type" name="request_type" value={formData.request_type} onChange={handleChange}>
                <option value="">Select an option</option> {/* Optional: default empty option */}
                <option key="0" value="Cleaning">Cleaning</option>
                <option key="1" value="Maintenance">Maintenance</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="request_detail">Details: </Form.Label>
              <Form.Control id="request_detail" type="textarea" name="request_detail" placeholder="Details:" value={formData.request_detail} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="task_priority">Priority: </Form.Label>
              <Form.Select id="task_priority" name="task_priority" value={formData.task_priority} onChange={handleChange}>
                <option value="">Select an option</option> {/* Optional: default empty option */}
                <option key="0" value="Low">Low</option>
                <option key="1" value="Medium">Medium</option>
                <option key="2" value="High">High</option>
                <option key="3" value="Urgent">Urgent</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="note">Notes: </Form.Label>
              <Form.Control id="note" type="textarea" name="note" placeholder="Notes:" value={formData.note} onChange={handleChange} />
            </Form.Group>
          </div>
        </div>
        {message !== "" && <p id="error-message">{message}</p>}
        <Button type="submit" disabled={loading}><span className="mr-5">Update Ticket</span></Button>
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

export default UpdateTicketForm;