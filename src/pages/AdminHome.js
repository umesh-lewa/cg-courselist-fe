import React, { useContext, useState, useEffect, useRef } from 'react';
import { Grid, Transition } from 'semantic-ui-react';
import { Button, Form, Segment, Divider } from 'semantic-ui-react';

import PlaceholderExampleGrid from "../components/PlaceholderExampleGrid";

import { AuthContext } from '../context/auth';
import S3 from 'react-aws-s3';
import axios from "axios";
import S3FileUpload from 'react-s3';
import { deleteFile } from 'react-s3';
import CourseCard from '../components/CourseCard';

function AdminHome(props) {

    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState()
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState();
    const [uploadProgress, updateUploadProgress] = useState(0);
    const [author, setAuthor] = useState();
    const [description, setDescription] = useState();
    const [courseKey, setCourseKey] = useState("");
    const [allCourses, setAllCourses] = useState([]);
    const [allCoursesDetails, setAllCoursesDetails] = useState([]);
    const [allCoursesWithDetails, setAllCoursesWithDetails] = useState([]);

    const fileInput = useRef();

    useEffect(() => {
        getFilesFromBucket();
    }, []);

    const getFilesFromBucket = async () => {

        const AWS = require('aws-sdk/global');

        const S3 = require('aws-sdk/clients/s3');

        AWS.config.update({
            accessKeyId: 'AKIAJAXL4KKUGRQD4XWA',
            secretAccessKey: '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',
            region: 'us-east-1'
        });

        const s3 = new AWS.S3();

        const params = {
            Bucket: "cg-courselist",
            Delimiter: '/',
            Prefix: "courses" + '/'
        };

        const data = await s3.listObjects(params).promise();

        console.log("on page show bucket data : " + JSON.stringify(data));

        for (let index = 1; index < data['Contents'].length; index++) {
            console.log(data['Contents'][index]['Key'])
        }
        let courses = data.Contents;

        let response = await fetch("https://cg-courselist-be.herokuapp.com/file/all");
    
        response = await response.json();
        if (response.stat === "200") {

          setAllCoursesDetails(response.result);

          console.log("allCourse Details : " + JSON.stringify(response.result));
            
          let details = response.result;

          console.log("details : "+details);

          if (response.result.length == 0) {
            console.log("no courses are there");
          } else {
            console.log("some courses are there");
          }
          
          let newArr = [];

          for (let index = 1; index < data['Contents'].length; index++) {

            let currentDetails = response.result.find(o => o.NAME == data['Contents'][index]['Key']);

            console.log("matching details : "+currentDetails);

              let newObj = {
                  "Name":currentDetails.NAME,
                  "Author":currentDetails.AUTHOR,
                  "Description":currentDetails.DESCRIPTION,
                  "RATING":currentDetails.RATING,
                  "Comments":currentDetails.COMMENTS
              }

              newArr.push(newObj);
              console.log("Pushing fin course obj"); 
          }
          /*
          for (let index = 1; index < response.result.length; index++) {

              let currentDetails = response.result.find(o => o.NAME == details[index]['Key']);
              
          }
          */
          console.log("newArr : "+JSON.stringify(newArr));
          setAllCoursesWithDetails(newArr);

        }

        /*
        s3.listObjectsV2(params, (err, data) => {
            if (err) throw err;
            console.log("data retrieved from bucket" + data.Contents);
        })
        */
    }

    /*
    const handleClick = (event) => {
      event.preventDefault();
      let file = fileInput.current.files[0];
      let newFileName = fileInput.current.files[0].name.replace(/\..+$/, "");
  
      const config = {
          bucketName: 'cg-courselist',
          dirName: 'courses', 
          region: 'us-east-1',
          accessKeyId: 'AKIAJAXL4KKUGRQD4XWA',
          secretAccessKey: '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',
      }
  
      const ReactS3Client = new S3(config);
  
      ReactS3Client.uploadFile(file, newFileName).then((data) => {
        console.log("upload data"+data);
        if (data.status === 204) {
          console.log("upload success");
        } else {
          console.log("upload fail");
        }
      })
      .catch((err) => {
          console.log("file upload error");
      });
    };
    */

    const uploadHandler = (event) => {

        setFiles(event.target.files)

    }


    const upload = (event) => {

        event.preventDefault();

        let file = fileInput.current.files[0];
        //console.log("file : "+file);
        //console.log("file : "+JSON.stringify(file));

        const config = {
            bucketName: 'cg-courselist',
            dirName: 'courses',
            region: 'us-east-1',
            accessKeyId: '',
            secretAccessKey: '',
        }

        console.log("uploading file");
        
        S3FileUpload
            .uploadFile(file, config)
            .then(data => {
                console.log(data);
                console.log("data : " + data);
                console.log("data : " + JSON.stringify(data));
                console.log("data.Key : " + data.key);
                console.log("String(data.key) : "+String(data.key));
                //setCourseKey(String(data.key));
                let CK = String(data.key);
                uploadFileDetails(CK);
                
            })
            .catch(err => console.error(err))

        
        
        console.log("done uploading file");
        
    }

    const uploadFileDetails = async (CK) => {

        const courseData = {
            
            "AuthorName": author,
            "Description": description,
            "CourseKey": CK,
        }

        console.log("courseData : "+JSON.stringify(courseData));
        
        
        setAuthor("");
        setDescription("");

        let response = await fetch("https://cg-courselist-be.herokuapp.com/file/uploadDetails", {
            //let response = await fetch("https://localhost:5000/admin/login", {    
            method: "POST",
            body: JSON.stringify(courseData),
            headers: {
                "Content-Type": "application/json"
            }
        })

        response = await response.json();
        if (response.stat === "200") {

            //history.push("/adminhome");
            return;
        } else {
            setLoading(false);
        }
        getFilesFromBucket();
        // setLoginMessage(response.message)
    }

    const getAllFileDetails = async () => {

        
    
      }

    return (

        <>
            <Grid columns={3}>

                <Grid.Row className="page-title centered">
                    <h1>Admin Home</h1>
                </Grid.Row>

                <Grid.Row>

                </Grid.Row>

            </Grid>

            {loading ? (

                <>
                    <h1>Loading Admin Posts..</h1>

                    <PlaceholderExampleGrid />

                </>

            ) : (

                    <>

                        <Grid columns={2}>
                            <Grid.Row>
                                <Transition.Group>
                                    {/*
                                    <Form onSubmit={upload} >
                                        
                                        <Form.Input
                                            icon='user'
                                            iconPosition='left'
                                            label="Upload File : "
                                            placeholder="Upload File.."
                                            //name="email"
                                            type="file"
                                            
                                            ref={fileInput} 
                                            onChange={uploadHandler}
                                        />
                                        {/*
                                        <Form.Input
                                            icon='lock'
                                            iconPosition='left'
                                            label="Password"
                                            placeholder="Password.."
                                            name="password"
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        /> 
                                        <Button type="submit" primary>
                                            Upload
                                        </Button>

                                        </Form>
                                        */}
                                    <form className='upload-steps' onSubmit={upload}>
                                        <label>
                                            Upload file:
                                            <input type='file' ref={fileInput} onChange={uploadHandler} />
                                        </label>
                                        <br />

                                        <label for="fname">Author Name:</label><br />
                                        <input type="text" onChange={e => setAuthor(e.target.value)}></input><br />
                                        <label for="lname">Description:</label><br />
                                        <input type="text" onChange={e => setDescription(e.target.value)}></input><br />

                                        <button type='submit'>Upload</button>
                                    </form>

                                </Transition.Group>
                            </Grid.Row>

                            <Grid.Row>
                                
                                {allCoursesWithDetails &&
                                    allCoursesWithDetails.map((course) => (
                                        <Grid.Column key={course.Name} style={{ marginBottom: 20 }}>
                                            <CourseCard course={course} getFilesFromBucket={getFilesFromBucket} />
                                        </Grid.Column>
                                    ))}

                            </Grid.Row>
                        </Grid>

                    </>

                )}

        </>


    );
}

export default AdminHome;