function mixArrays(array1, array2) {
  const mixedArray = [];

  array1.forEach((section1) => {
    const section2 = array2.find(
      (section) => section.sectionTitle === section1.sectionTitle
    );

    const mixedFields = [];

    section1.fields.forEach((field1) => {
      const field2 = section2
        ? section2.fields.find(
            (field) => field.fieldTitle === field1.fieldTitle
          )
        : null;

      mixedFields.push({
        fieldTitle: field1.fieldTitle,
        content1: field1.content,
        content2: field2 ? field2.content : "",
        _id: field1._id,
        display: field1.display || (field2 ? field2.display : false),
      });
    });

    if (section2) {
      section2.fields.forEach((field2) => {
        const field1 = section1.fields.find(
          (field) => field.fieldTitle === field2.fieldTitle
        );
        if (!field1) {
          mixedFields.push({
            fieldTitle: field2.fieldTitle,
            content1: "",
            content2: field2.content,
            _id: field2._id,
            display: field2.display,
          });
        }
      });
    }

    mixedArray.push({
      sectionTitle: section1.sectionTitle,
      fields: mixedFields,
      _id: section1._id,
    });
  });

  array2.forEach((section2) => {
    const section1 = array1.find(
      (section) => section.sectionTitle === section2.sectionTitle
    );
    if (!section1) {
      const fields = section2.fields.map((field2) => ({
        fieldTitle: field2.fieldTitle,
        content1: "",
        content2: field2.content,
        _id: field2._id,
        display: field2.display,
      }));

      mixedArray.push({
        sectionTitle: section2.sectionTitle,
        fields,
        _id: section2._id,
      });
    }
  });

  return mixedArray;
}

export { mixArrays };
