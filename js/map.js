// Interactive Map functionality
document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
     
        const map = L.map('map').setView([-28.4793, 24.6727], 5);

   s
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

       
        const shelterLocation = L.marker([-26.195246, 28.034088])
            .addTo(map)
            .bindPopup(`
                <strong>Ubuntu Animal Rescue Main Shelter</strong><br>
                123 Animal Rescue Street<br>
                Johannesburg, South Africa<br>
                Phone: +27 11 123 4567
            `)
            .openPopup();

       
        shelterLocation.on('click', function() {
            alert('Get directions to our shelter!');
        });

      
        const locations = [
            {
                coords: [-33.9249, 18.4241],
                name: "Cape Town Branch",
                info: "Our Western Cape rescue center"
            },
            {
                coords: [-29.8587, 31.0218],
                name: "Durban Outreach",
                info: "KwaZulu-Natal animal rescue services"
            }
        ];

        locations.forEach(location => {
            L.marker(location.coords)
                .addTo(map)
                .bindPopup(`<strong>${location.name}</strong><br>${location.info}`);
        });
    }
});
