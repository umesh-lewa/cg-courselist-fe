import React, { useContext, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

import { AuthContext } from '../context/auth';

function MenuBar() {

    const { user, logout } = useContext(AuthContext);

    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substr(1);
    //const [activeItem, setActiveItem] = useState(path);
    const [activeItem, setActiveItem] = useState("posts");
    const history = useHistory();

    const handleItemClick = (e, { name }) => setActiveItem(name);

    const handleLogout = () => {
        logout();
        history.push("/");
    }

    const menuBar = user ? (
        //const menuBar = isLogggedIn ? (   
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item
                name={user.username}
            /*
            active={activeItem === user.username}
            as={Link} to="/home"
            */
            />
            <Menu.Item
                name="courses"
                active={activeItem === 'posts'}
                onClick={handleItemClick}
                as={Link}
                to="/home" />

            <Menu.Menu position="right">
                <Menu.Item
                    name="Your Profile"
                    active={activeItem === 'Your Profile'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/profile" />
                <Menu.Item
                    name="logout"
                    onClick={handleLogout} />
            </Menu.Menu>
        </Menu>
    ) : (
            <Menu pointing secondary size="massive" color="teal">
                <Menu.Item
                    name="About"
                    active={activeItem === 'home'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/"
                />

                <Menu.Menu position="right">
                    <Menu.Item
                        name="login"
                        active={activeItem === 'login'}
                        onClick={handleItemClick}
                        as={Link}
                        to="/login"
                    />
                    <Menu.Item
                        name="register"
                        active={activeItem === 'register'}
                        onClick={handleItemClick}
                        as={Link}
                        to="/register"
                    />
                </Menu.Menu>
            </Menu>
        );

    return menuBar;
}

export default MenuBar;