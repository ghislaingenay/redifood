import { PlusOutlined } from "@ant-design/icons";
import { faFilePen, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Form, Popover, Select } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Case, Default, Switch } from "react-if";
import { GREY } from "../../constants";
import { optionsCreateFood } from "../../constants/food.const";
import { useFood } from "../../contexts/food.context";
import { convertFoodToSection } from "../../functions/food.fn";
import { capitalize } from "../../functions/global.fn";
import { EButtonType, IFood, IFormInterface } from "../../interfaces";
import { SpacingDiv5X } from "../../styles/styledComponents/div.styled";
import { RedSpan } from "../../styles/styledComponents/span.styled";
import { LabelFormBlack, LabelFormOrange, RoundedInput } from "../../styles/styledComponents/typography.styled";
import { RediButton } from "../styling/Button.style";
import { RowCenter } from "../styling/grid.styled";
import RediRadioButton, { Booleanish } from "../styling/RediRadioButton";
const { Option } = Select;
interface IFoodForm {
  foodSection: string[];
  foodList: IFood[];
}
const FoodForm = ({ foodSection, foodList }: IFoodForm) => {
  const {
    foodOrder,
    functions: { selectFood },
  } = useFood();
  const [form] = Form.useForm();
  const pictureSize = 150;
  const pictureValue = Form.useWatch("itemPhoto", form);
  const sectionValue = Form.useWatch("itemSection", form);
  const extraValue = Form.useWatch("itemExtra", form);
  const [editMode, setEditMode] = useState<Booleanish>("false");

  const foodRadioOptions = [
    { label: "EDIT", value: "false", icon: <FontAwesomeIcon icon={faFilePen} /> },
    { label: "CREATE", value: "true", icon: <FontAwesomeIcon icon={faSquarePlus} /> },
  ];

  const [sortedFood, setSortedFood] = useState<Record<string, string[]>>({});

  const [currentFood, setCurrentFood] = useState<IFood>(foodOrder[0]);
  const [newFoodData, setNewFoodData] = useState<IFood | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [inputSection, setInputSection] = useState<string>("");
  const [inputExtra, setInputExtra] = useState<string>("");
  const [selectedExtra, setSelectedExtra] = useState<string>("");

  const onFinish = (values: any) => {
    console.log("submitted", values);
    if (foodOrder[0] === currentFood) {
      console.log("can cancel");
    } else {
      console.log("cannot cancel");
    }
  };
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  // const [previewTitle, setPreviewTitle] = useState("");

  // const [fileList, setFileList] = useState<UploadFile[]>([]);

  // const onFinish = (values: any) => {};
  // const cancelUpload = () => setPreviewOpen(false);

  // const handlePreview = async (file: UploadFile) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj as RcFile);
  //   }
  //   setPreviewImage(file.url || (file.preview as string));
  //   setPreviewOpen(true);
  //   setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  // };
  // const uploadButton = (
  //   <div style={{ border: `0.125rem dashed ${GREY}`, borderRadius: "50%", width: "100%" }}>
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

  // const handlePictureChange: UploadProps["onChange"] = ({ fileList: newFileList }) => setFileList(newFileList);
  // const getBase64 = (file: RcFile): Promise<string> =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });

  // if (foodOrder[0] === currentFood) {

  useEffect(() => {
    if (editMode === "false" && foodOrder.length !== 0) {
      console.log("fdp", foodOrder[0]);
      setCurrentFood(foodOrder[0]);
      form.setFieldsValue({
        itemName: foodOrder[0].itemName,
        itemDescription: foodOrder[0].itemDescription,
        itemPrice: foodOrder[0].itemPrice,
        itemPhoto: foodOrder[0].itemPhoto,
        itemSection: foodOrder[0].itemSection,
        itemExtra: foodOrder[0].itemExtra,
      });
      setSortedFood(convertFoodToSection(foodList, foodSection));
      setSelectedSection(foodOrder[0].itemSection);
      setSelectedExtra(foodOrder[0].itemExtra);
    } else {
      form.setFieldsValue({
        itemSection: "none",
        itemExtra: "none",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFood, editMode]);
  return (
    <SpacingDiv5X>
      <RediRadioButton
        radioGroupName="food"
        padding="0.5rem 1rem"
        fontSize="0.75rem"
        options={foodRadioOptions}
        haveIcon={"true"}
        selectedButton={editMode}
        setSelectedButton={setEditMode}
        clickedFn={() => {
          form.setFieldsValue({});
        }}
      />
      <Switch>
        <Case condition={editMode === "false" && foodOrder.length === 0}>
          <Alert
            type="warning"
            style={{ fontWeight: 700, height: "80vh", textAlign: "center", fontSize: "1rem", marginTop: "1.5rem" }}
            message="Please a select a food to update"
          />
        </Case>
        <Default>
          <RowCenter style={{ marginTop: "1rem" }}>
            {pictureValue ? (
              <Image
                height={pictureSize}
                width={pictureSize}
                style={{ borderRadius: "50%", border: `1px dashed ${GREY}`, margin: "0 auto 1rem" }}
                src={pictureValue}
                alt="new food picture"
              />
            ) : (
              <RowCenter
                style={{
                  width: { pictureSize },
                  height: { pictureSize },
                  border: `1px dashed ${GREY}`,
                  margin: "0 auto 1rem",
                  borderRadius: "50%",
                }}
              >
                <PlusOutlined /> Upload
              </RowCenter>
            )}
          </RowCenter>

          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            onValuesChange={(e, all) => {
              console.log("all", all);
              console.log(e);
              form.setFieldsValue(all);
              if (editMode === "true") {
                setNewFoodData(all);
              }
            }}
          >
            {optionsCreateFood.map(({ label, name, component, rules }: IFormInterface) => {
              return (
                <>
                  <LabelFormBlack htmlFor={name}>
                    {label} <RedSpan>*</RedSpan>
                  </LabelFormBlack>
                  <Form.Item
                    id={name}
                    style={{ fontWeight: 700, marginBottom: "0.5rem" }}
                    key={name}
                    name={name}
                    rules={rules}
                  >
                    {component}
                  </Form.Item>
                </>
              );
            })}
            <LabelFormBlack htmlFor="itemSection">
              Section <RedSpan>*</RedSpan>
            </LabelFormBlack>
            <Form.Item name="itemSection" id="itemSection">
              <Select
                style={{ borderRadius: "2rem" }}
                // options={getOptions(foodSection).push({ label: "Add Section", value: "addSection" })}
                onChange={() => {
                  form.setFieldValue("itemExtra", "");
                }}
              >
                <Option value="none">Select ...</Option>
                {foodSection.map((section, index) => (
                  <Option key={index} value={section}>
                    {capitalize(section)}
                  </Option>
                ))}
                <Option value="addSection">Add Section</Option>
              </Select>
            </Form.Item>
            <Switch>
              <Case condition={sectionValue === "addSection"}>
                <>
                  <LabelFormOrange>Create a new section</LabelFormOrange>
                  <RoundedInput value={inputSection} onChange={(e) => setInputSection(e.target.value)} />
                  <Popover>
                    <RediButton
                      buttonType={EButtonType.SUCCESS}
                      disabled={inputSection === "" ? true : false}
                      onClick={() => {
                        console.log("new section clicked", inputSection);
                      }}
                    >
                      Create Section
                    </RediButton>
                  </Popover>
                </>
              </Case>
              <Case style={{ margin: 0 }} condition={sectionValue !== "addSection" && sectionValue !== "all"}>
                <>
                  <LabelFormBlack htmlFor="itemExtra">
                    Extra <RedSpan>*</RedSpan>
                  </LabelFormBlack>
                  <Form.Item name="itemExtra" id="itemExtra" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                    <Select>
                      <Option value="none">Select ...</Option>
                      {sortedFood[selectedSection]?.map((extra, index) => (
                        <Option key={index} value={extra}>
                          {capitalize(extra)}
                        </Option>
                      ))}
                      <Option value="addExtra">Add Extra</Option>
                    </Select>
                  </Form.Item>
                </>
              </Case>
            </Switch>
          </Form>
        </Default>
      </Switch>
      {/* <Form.Item style={{ fontWeight: 700 }} key={name} name={name} label={label} rules={rules}></Form.Item> */}
    </SpacingDiv5X>
  );
};

export default FoodForm;
