import React, { useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import S3FileUpload from 'react-s3';

import MyPopup from '../util/MyPopup';

function DeleteCourse({ coursename, getFilesFromBucket }) {


    const [confirmOpen, setConfirmOpen] = useState(false);

    const deleteCourse = async () => {

        setConfirmOpen(false);

        const config = {
            bucketName: 'cg-courselist',
            dirName: 'courses',
            region: 'us-east-1',
            accessKeyId: '',
            secretAccessKey: '',
        }

        console.log("deleting file");

        S3FileUpload
            .deleteFile(coursename, config)
            .then(response => console.log(response))
            .catch(err => console.error(err))

        console.log("done deleting file");

        let response = await fetch("https://cg-courselist-be.herokuapp.com/file/deleteDetails", {
            method: "DELETE",
            body: JSON.stringify({
                "CourseName": coursename,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        response = await response.json()
        if (response.stat === "200") {

            getFilesFromBucket();
        } else {
            getFilesFromBucket();
        }

    }

    const handleDelete = async () => {
        deleteCourse();
    }

    return (
        <>
            <MyPopup content={'Delete Course'}>
                <Button
                    as="div"
                    color="red"
                    floated="right"
                    onClick={() => setConfirmOpen(true)}
                >
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );

}

export default DeleteCourse;