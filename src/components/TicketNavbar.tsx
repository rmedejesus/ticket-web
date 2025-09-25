import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext } from 'react';
import type { ILoggedUser } from '../types/user';
import { UserContext } from '../context/user.context';

const TicketNavbar: React.FC = () => {
  let { user, logout } = useContext(UserContext);
  const userData = JSON.parse(localStorage.getItem("user")!);

  if (user === null && userData !== null) {
    const newUser: ILoggedUser = {
      id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
    };

    user = newUser;
  }

  return (
    <Navbar expand="lg" className="sj-navbar navbar-dark bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/"><img src="/sj-horizontal.png"></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user &&
              <NavDropdown align="end" title={"Welcome " + user!.first_name + ' ' + user!.last_name + '!'} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={logout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            }
            {/* {(user && !userData) &&
              <NavDropdown title={"Welcome " + userData!.first_name + ' ' + userData!.last_name + '!'} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={logout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            } */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TicketNavbar;