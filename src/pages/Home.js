import React, { useContext, useState, useEffect } from 'react';
import { Grid, Transition } from 'semantic-ui-react';
import { Placeholder, Segment, Rail } from 'semantic-ui-react';
import CourseCardUser from '../components/CourseCardUser';

import PlaceholderExampleGrid from "../components/PlaceholderExampleGrid";

import { AuthContext } from '../context/auth';

function Home(props) {

  const [isCourses, setIsCourses] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allCoursesDetails, setAllCoursesDetails] = useState([]);
  const [allCoursesWithDetails, setAllCoursesWithDetails] = useState([]);

  useEffect(() => {
    getFilesFromBucket();
  }, []);

  const getFilesFromBucket = async () => {

    const AWS = require('aws-sdk/global');

    const S3 = require('aws-sdk/clients/s3');

    AWS.config.update({
      accessKeyId: '',
      secretAccessKey: '',
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

      console.log("details : " + details);

      if (response.result.length == 0) {
        console.log("no courses are there");
      } else {
        console.log("some courses are there");
      }

      let newArr = [];

      for (let index = 1; index < data['Contents'].length; index++) {

        let currentDetails = response.result.find(o => o.NAME == data['Contents'][index]['Key']);

        console.log("matching details : " + currentDetails);

        let newObj = {
          "Name": currentDetails.NAME,
          "Author": currentDetails.AUTHOR,
          "Description": currentDetails.DESCRIPTION,
          "RATING": currentDetails.RATING,
          "Comments": currentDetails.COMMENTS
        }

        newArr.push(newObj);
        console.log("Pushing fin course obj");
      }

      console.log("newArr : " + JSON.stringify(newArr));
      setAllCoursesWithDetails(newArr);

    }

  }

  return (

    <>
      <Grid columns={3}>

        <Grid.Row className="page-title centered">
          <h1>User Home</h1>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>

          </Grid.Column>
        </Grid.Row>

      </Grid>

      {loading ? (

        <>
          <h1>Loading Courses..</h1>

          <PlaceholderExampleGrid />

        </>

      ) : (

          <>
            {isCourses ? (
              <Grid columns={2}>
                <Grid.Row>
                  <Transition.Group>
                    {allCoursesWithDetails &&
                      allCoursesWithDetails.map((course) => (
                        <Grid.Column key={course.Name} style={{ marginBottom: 20 }}>
                          <CourseCardUser course={course} getFilesFromBucket={getFilesFromBucket} />
                        </Grid.Column>
                      ))}

                  </Transition.Group>
                </Grid.Row>
              </Grid>
            ) : (
                <h2>No Courses Yet ! Ask Adimin to Upload !</h2>
              )}
          </>

        )}

    </>

  );
}

export default Home;