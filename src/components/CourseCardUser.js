
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Icon, Label, Image, Input, Popup } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

function CourseCardUser({ course, getFilesFromBucket }) {

    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [currentComment, setCurrentComment] = useState("");

    const [allComments, setAllComments] = useState("");

    useEffect(() => {
        getAllComments();
    }, []);

    const getAllComments = async () => {

        console.log("course.Name : " + course.Name);

        let courName = course.Name.toString();
        let cName = courName.split('/');

        const allCommentData = {
            "CourseName": cName[1],
        }

        console.log("allCommentData : " + JSON.stringify(allCommentData));

        let response = await fetch("https://cg-courselist-be.herokuapp.com/file/getComments/" + cName[1]);

        response = await response.json();
        if (response.stat === "200") {

            console.log("response.result[0].COMMENTS : " + response.result[0].COMMENTS);
            setAllComments(response.result[0].COMMENTS);
            return;
        } else {
            setLoading(false);
        }

    }

    const addComment = async () => {

        setLoading(true);


        const commentData = {
            "CourseName": course.Name,
            "Comment": currentComment
        }

        console.log("commentData : " + JSON.stringify(commentData));

        let response = await fetch("https://cg-courselist-be.herokuapp.com/file/addComment", {
            method: "POST",
            body: JSON.stringify(commentData),
            headers: {
                "Content-Type": "application/json"
            }
        })

        response = await response.json();
        if (response.stat === "200") {

            console.log("successfully added comment");
            getAllComments();
            return;
        } else {
            setLoading(false);
        }

        setLoading(false);

    }

    return (
        <Card fluid>

            <Card.Content>

                <video width="450" height="300" controls >
                    <source src= {course.URL} type="video/mp4" />
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

                <Button content='Submit' onClick={addComment} />

                {loading ? (
                    <Input className="loading" placeholder='Comment...' />
                ) : (
                        <Input placeholder='Comment...' onChange={e => setCurrentComment(e.target.value)} />
                    )}

                <Popup
                    content={
                        <>
                            allComments : {allComments}
                        </>
                    }
                    on='click'
                    popper={{ id: 'popper-container', style: { zIndex: 2000 } }}
                    trigger={<Button>View Comments</Button>}
                />

            </Card.Content>
        </Card>
    );
}

export default CourseCardUser;