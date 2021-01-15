
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

import DeleteCourse from './DeleteCourse';

function CourseCard({ course, getFilesFromBucket }) {

    const { user } = useContext(AuthContext);

    useEffect(() => {

    }, []);


    return (
        <Card fluid>

            <Card.Content>

                <video width="450" height="300" controls >
                    <source src={course.URL} type="video/mp4" />
                </video>

                <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/wireframe/image.png"
                />
                <Card.Header>Name : {course.Name}</Card.Header>
                <Card.Meta >
                    Author : {course.Author}
                </Card.Meta>
                <Card.Description>Description :{course.Description}</Card.Description>

            </Card.Content>

            <Card.Content extra>

                <DeleteCourse coursename={course.Name} getFilesFromBucket={getFilesFromBucket} />

            </Card.Content>
        </Card>
    );
}

export default CourseCard;