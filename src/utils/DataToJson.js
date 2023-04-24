const jsonConverter = (jsonData, filename) => {

   const sample = {
        "users": [
          {
            "id": 1,
            "name": "Caitlyn",
            "surname": "Kerluke",
            "age": 24
          },
          {
            "id": 2,
            "name": "Rowan ",
            "surname": "Nikolaus",
            "age": 45
          },
          {
            "id": 3,
            "name": "Kassandra",
            "surname": "Haley",
            "age": 32
          },
          {
            "id": 4,
            "name": "Rusty",
            "surname": "Arne",
            "age": 58
          }
        ]
      }
        // const fileData = JSON.stringify(sample);
        // const blob = new Blob([fileData], {type: "text/plain"});
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.download = `${filename}.json`;
        // link.href = url;
        // link.click();

        const downloadFile = ({ data, fileName, fileType }) => {
            // Create a blob with the data we want to download as a file
            const blob = new Blob([data], { type: fileType })
            // Create an anchor element and dispatch a click event on it
            // to trigger a download
            const a = document.createElement('a')
            a.download = fileName
            a.href = window.URL.createObjectURL(blob)
            const clickEvt = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
            })
            a.dispatchEvent(clickEvt)
            a.remove()
          }
          
     
          downloadFile({
            data: JSON.stringify(jsonData, null, " "),
            fileName: `${filename}.json`,
            fileType: 'text/json',
          })
      }



      export default jsonConverter;
