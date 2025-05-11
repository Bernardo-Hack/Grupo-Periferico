import { useState } from 'react';
import { Navbar as BsNavbar, Nav, Container, Button, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export const Navbar = () => {
  const [expanded, setExpanded] = useState(false);

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
            
            {/* Dropdown Doar */}
            <NavDropdown title="Doar" id="dropdown-doar">
              <NavDropdown.Item as={Link} to="/doacao-monetaria">
              Doação Monetária
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/doacao-roupas-alimentos">
              Doação de Alimentos
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            
            {/* Avatar Dropdown */}
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
              <NavDropdown.Item as={Link} to="/configuracoes">Configurações</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">Sair</NavDropdown.Item>
            </NavDropdown>
            </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};
