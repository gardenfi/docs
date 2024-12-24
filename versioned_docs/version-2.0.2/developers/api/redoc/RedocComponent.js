import React from 'react';
import { RedocStandalone } from 'redoc';
import "./@theme/styles.css"
const RedocComponent = ({ specUrl }) => (
    <RedocStandalone
      specUrl={specUrl}
      options={
        {
          theme: {
            sidebar: {
              backgroundColor: '#f4f4f4',
              textColor: '#333',
            }
          },
          typography: {
            fontFamily: "'Montserrat', sans-serif",
          },
          showExtensions: true,
        }
      }
    />
    );

export default RedocComponent;
