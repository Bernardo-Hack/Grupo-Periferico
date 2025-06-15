import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Navbar as BsNavbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Image
} from 'react-bootstrap';
import '../style/navbarCSS.css';

export const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate(); // usar para redirecionar após logout

  const handleLogout = () => {
    fetch('http://localhost:5000/user/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          navigate('/login'); // redireciona para login
        } else {
          alert('Erro ao sair da conta.');
        }
      })
      .catch(err => {
        console.error('Erro no logout:', err);
        alert('Erro de conexão ao sair da conta.');
      });
  };

  return (
    <BsNavbar 
      expand="lg" 
      className="navbar-dark bg-black fixed-top border border-white"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid>
        <BsNavbar.Toggle 
          aria-controls="navbarTogglerDemo03" 
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </BsNavbar.Toggle>

        <BsNavbar.Brand as={Link} to="/">ONG Grupo Periférico</BsNavbar.Brand>

        <BsNavbar.Collapse id="navbarTogglerDemo03">
          <Nav className="ms-auto mb-2 mb-lg-0">
            <NavDropdown title="Doar" id="dropdown-doar">
              <NavDropdown.Item as={Link} to="/doacao-monetaria">
                Doação Monetária
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/doacao-alimentos">
                Doação de Alimentos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/doacao-roupas">
                Doação de Roupas
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/registro">Login</Nav.Link>

            <NavDropdown
              title={
                <Image
                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp"
                  roundedCircle
                  height="22"
                  alt="Foto do Perfil"
                  loading="lazy"
                />
              }
              id="navbarDropdownMenuLink"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/perfil">Meu Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};
