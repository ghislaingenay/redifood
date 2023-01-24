import { Radio, Row } from "antd";

interface IButtonLayout {
  setSelectedSection: (e: string) => void;
  foodSection: string[];
  selectedSection: string;
  changeActiveButton: (sectionName: string) => void;
}

const ButtonLayout = ({
  selectedSection,
  setSelectedSection,
  foodSection,
  changeActiveButton,
}: IButtonLayout): JSX.Element => {
  const styleGround = {
    color: "white",
  };

  return (
    <Row justify="space-between" style={{ marginBottom: "1rem" }}>
      <Radio.Group
        onChange={(e) => {
          setSelectedSection(e.target.value);
          return changeActiveButton(e.target.value);
        }}
        value={selectedSection}
      >
        <Radio.Button value="all">ALL</Radio.Button>
        {foodSection.map((section, index) => (
          <Radio.Button key={index} value={section}>
            {section.toUpperCase()}
          </Radio.Button>
        ))}
      </Radio.Group>
      {/* <Col lg={4}>
        <RediButton
          style={{ ...styleGround, backgroundColor: selectedSection === "all" && PRIMARY_COLOR }}
          name="all"
          haveIcon={false}
          typeButton="info"
          title="ALL"
          onClick={(e) => clickedButton(e)}
        />
      </Col>
      {foodSection.map((section, index) => (
        <Col key={index} lg={4}>
          <RediButton
            style={{ ...styleGround, backgroundColor: selectedSection === section && PRIMARY_COLOR }}
            name={section}
            haveIcon={false}
            typeButton="info"
            title={`${section.toUpperCase()}`}
            onClick={(e) => clickedButton(e)}
          />
        </Col>
      ))} */}
    </Row>
  );
};

export default ButtonLayout;
