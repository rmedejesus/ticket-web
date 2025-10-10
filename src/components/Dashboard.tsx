import React, { useEffect, useState } from 'react';
import TicketService from '../services/ticket.service';
import TokenService from "../services/token.service";
import type { ITicket } from '../types/ticket';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../types/user';
import userService from '../services/user.service';
import TicketTable from './TicketTable';

const Dashboard: React.FC = () => {
  const [content, setContent] = useState<ITicket[]>([]);
  const [filteredContent, setFilteredContent] = useState<ITicket[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const user = TokenService.getUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          await userService.getUsers(),
          await TicketService.getTickets()
        ]);

        setUsers(response1.data.users);
        setContent(response2.data.tickets);

      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(content)) {
      if (content.length > 0) {
        const newFilteredData = content.filter(item =>
          item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.reported_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (users?.find(user => user.id === item.assigned_to)?.first_name?.toLowerCase() + " " + users?.find(user => user.id === item.assigned_to)?.last_name?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
          item.accommodation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.accommodation_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.task_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.task_priority.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredContent(newFilteredData);
        
      }
    }
    //setLoading(false);
  }, [searchTerm, content]);
  

  const handleCreateTicket = () => {
    navigate('/create-ticket');
  };

  return (
    <div className="main-container">
      <div className="d-flex mb-4 gap-3 upper-container">
        {(user.id !== "HXMidxnxozPkc0Q1QgNU" && user.id !== "5XCQaqFvqjLk34jfw4VF") ? <Button className="text-nowrap create-btn" onClick={handleCreateTicket}>
          Create a New Ticket
        </Button> : ""}
        <input
          type="text"
          placeholder="Search by Staff Name, Accommodation Name, Accommodation Type, Request Type, Status, or Priority..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded search-terms"
        />
      </div>
      <div id="table-container">
        {!loading ? (filteredContent.length > 0 && users.length > 0 ? <TicketTable data={filteredContent!} users={users!} rowsPerPage={5} /> : <p>No data</p>) : <div id="loading-data"><p className="spinner-grow custom-spinner-size text-danger"></p><h3>Loading tickets...</h3></div>}
      </div>
    </div>
  );
};

export default Dashboard;