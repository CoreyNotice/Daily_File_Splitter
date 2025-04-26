export function sortDistricts(baseData) {
    // Initialize arrays for different location categories
    const schoolDistricts = [];
    const centralDistricts = [];
    const specialDistricts = [];
    const masterFile = baseData.map(entry => ({ ...entry })); // Deep copy of baseData

    // Iterate over the baseData array
    baseData.forEach(entry => {
        // Extract the first two characters from the Location field and parse them as a number
        const locationNumber = parseInt(entry.Location.substring(0, 2), 10);

        if (locationNumber >= 1 && locationNumber < 33) {
            // Locations 01 to 32 belong to School Locations
            schoolDistricts.push({ ...entry });
        } else if (
            locationNumber >= 33 && 
            locationNumber < 99 && 
            ![79, 85, 97].includes(locationNumber)
        ) {
            // Locations 33 to 99 (excluding 79, 85, 97) belong to Central Locations
            centralDistricts.push({ ...entry });
        } else if ([79, 85, 97].includes(locationNumber)) {
            // Locations 79, 85, 97 belong to Special Locations
            specialDistricts.push({ ...entry });
        }
    });

    // Return the sorted arrays
    return {
        specialDistricts,
        centralDistricts,
        schoolDistricts,
        masterFile
    };
}


    
