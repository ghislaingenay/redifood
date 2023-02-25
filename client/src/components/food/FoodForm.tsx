import { PlusOutlined } from "@ant-design/icons";
import { faBan, faFileCircleCheck, faFilePen, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Form, Select } from "antd";
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
import {
  LabelFormBlack,
  LabelFormBlue,
  LabelFormRed,
  RoundedInput,
} from "../../styles/styledComponents/typography.styled";
import { RediButton, RediIconButton } from "../styling/Button.style";
import { RowCenter, RowCenterSp } from "../styling/grid.styled";
import RediRadioButton, { Booleanish } from "../styling/RediRadioButton";
const { Option } = Select;
interface IFoodForm {
  foodSection: string[];
  foodList: IFood[];
}

enum EHandleType {
  NONE = "NONE",
  CREATE = "CREATE",
  EDIT = "EDIT",
  ADDSECTION = "ADDSECTION",
  DELETESECTION = "DELETESECTION",
  ADDEXTRA = "ADDEXTRA",
  DELETEEXTRA = "DELETEEXTRA",
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

  const [handleType, setHandleType] = useState<EHandleType>(EHandleType.NONE);

  const foodRadioOptions = [
    { label: "EDIT", value: "false", icon: <FontAwesomeIcon icon={faFilePen} /> },
    { label: "CREATE", value: "true", icon: <FontAwesomeIcon icon={faSquarePlus} /> },
  ];

  const [sortedFood, setSortedFood] = useState<Record<string, string[]>>({});

  const [currentFood, setCurrentFood] = useState<IFood>(foodOrder[0]);
  const [newFoodData, setNewFoodData] = useState<IFood | null>(null);
  const [inputSection, setInputSection] = useState<string>("");
  const [delSection, setDelSection] = useState<string>("");
  const [inputExtra, setInputExtra] = useState<string>("");
  const [delExtra, setDelExtra] = useState<string>("");
  const [selectedExtra, setSelectedExtra] = useState<string>("");

  const isDisabled =
    sectionValue === EHandleType.NONE ||
    sectionValue === EHandleType.ADDSECTION ||
    sectionValue === EHandleType.DELETESECTION ||
    extraValue === EHandleType.NONE ||
    extraValue === EHandleType.ADDEXTRA ||
    extraValue === EHandleType.DELETEEXTRA
      ? true
      : false;

  const onFinish = (values: any) => {
    switch (handleType) {
      case EHandleType.ADDSECTION: {
        console.log("new section added", inputSection);
        setInputSection("");
        break;
      }
      case EHandleType.DELETESECTION: {
        console.log("deleted section", delSection);
        setDelSection("");
        form.setFieldValue("itemSection", EHandleType.NONE);
        break;
      }
      case EHandleType.ADDEXTRA: {
        console.log("created extra", inputExtra);
        form.setFieldValue("itemExtra", EHandleType.NONE);
        setInputExtra("");
        break;
      }
      case EHandleType.DELETEEXTRA: {
        console.log("deleted extra", delExtra);
        form.setFieldValue("itemExtra", EHandleType.NONE);
        setDelExtra("");
        break;
      }
      default: {
      }
    }
    console.log("submitted", values);
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
    } else {
      form.setFieldsValue({
        itemSection: EHandleType.NONE,
        itemExtra: EHandleType.NONE,
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
            <Form.Item name="itemSection" id="itemSection" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              <Select
                style={{ borderRadius: "2rem" }}
                // options={getOptions(foodSection).push({ label: "Add Section", value: "addSection" })}
                onChange={() => {
                  form.setFieldValue("itemExtra", "none");
                }}
              >
                <Option value={EHandleType.NONE}>Select ...</Option>
                {foodSection.map((section, index) => (
                  <Option key={index} value={section}>
                    {capitalize(section)}
                  </Option>
                ))}
                <Option value={EHandleType.ADDSECTION}>Add Section</Option>
                <Option value={EHandleType.DELETESECTION}>Delete Section</Option>
              </Select>
            </Form.Item>
            <Switch>
              <Case condition={sectionValue === EHandleType.ADDSECTION}>
                <>
                  <LabelFormBlue>Create a new section</LabelFormBlue>
                  <RowCenterSp>
                    <RoundedInput value={inputSection} onChange={(e) => setInputSection(e.target.value)} />
                    <RediButton
                      buttonType={EButtonType.CREATE}
                      disabled={inputSection === "" ? true : false}
                      onClick={() => {
                        // ViewSectionModel
                        form.setFieldValue("itemSection", "none");
                        setHandleType(EHandleType.ADDSECTION);
                        setInputSection("");
                        console.log("new section clicked", inputSection);
                      }}
                    >
                      Create Section
                    </RediButton>
                  </RowCenterSp>
                </>
              </Case>
              <Case condition={sectionValue === EHandleType.DELETESECTION}>
                <>
                  <LabelFormRed>Delete a section</LabelFormRed>
                  <RowCenterSp>
                    <Select value={delSection} style={{ marginBottom: "0.5rem" }} onChange={(e) => setDelSection(e)}>
                      <Option value="">Select ...</Option>
                      {Object.keys(sortedFood).map((section, index) => (
                        <Option key={index} value={section}>
                          {capitalize(section)}
                        </Option>
                      ))}
                    </Select>
                    <RediButton
                      buttonType={EButtonType.ERROR}
                      style={{ marginTop: "0.5rem" }}
                      disabled={delSection === "" || delSection === "all" ? true : false}
                      onClick={() => {
                        // ViewSectionModel
                        setHandleType(EHandleType.DELETESECTION);
                        form.submit();
                      }}
                    >
                      Create Section
                    </RediButton>
                  </RowCenterSp>
                </>
              </Case>
              <Case condition={sectionValue !== "all" && sectionValue !== EHandleType.NONE}>
                <>
                  <LabelFormBlack htmlFor="itemExtra">
                    Extra <RedSpan>*</RedSpan>
                  </LabelFormBlack>
                  <Form.Item name="itemExtra" id="itemExtra" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                    <Select>
                      <Option value={EHandleType.NONE}>Select ...</Option>
                      {sortedFood[sectionValue]?.map((extra, index) => (
                        <Option key={index} value={extra}>
                          {capitalize(extra)}
                        </Option>
                      ))}
                      <Option value={EHandleType.ADDEXTRA}>Add Extra</Option>
                      <Option value={EHandleType.DELETEEXTRA}>Delete Extra</Option>
                    </Select>
                  </Form.Item>
                </>
                {extraValue === EHandleType.ADDEXTRA && (
                  <>
                    <LabelFormBlue>Create a new extra</LabelFormBlue>
                    <RowCenterSp>
                      <RoundedInput value={inputExtra} onChange={(e) => setInputExtra(e.target.value)} />
                      <RediButton
                        buttonType={EButtonType.CREATE}
                        disabled={inputExtra === "" ? true : false}
                        onClick={() => {
                          // ViewExtraModel
                          form.setFieldValue("itemExtra", "none");
                          setHandleType(EHandleType.ADDEXTRA);
                          form.submit();
                        }}
                      >
                        Create Extra
                      </RediButton>
                    </RowCenterSp>
                  </>
                )}
                {extraValue === EHandleType.DELETEEXTRA && (
                  <>
                    <LabelFormRed>Delete extra</LabelFormRed>
                    <RowCenterSp style={{ marginBottom: 0 }}>
                      <Select value={delExtra} onChange={(e) => setDelExtra(e)}>
                        <Option value="">Select ...</Option>
                        {sortedFood[sectionValue]?.map((section, index) => (
                          <Option key={index} value={section}>
                            {capitalize(section)}
                          </Option>
                        ))}
                      </Select>
                      <RediButton
                        buttonType={EButtonType.ERROR}
                        disabled={delExtra === "" ? true : false}
                        onClick={() => {
                          // ViewExtraModel
                          form.setFieldValue("itemExtra", "none");
                          setHandleType(EHandleType.DELETEEXTRA);
                          form.submit();
                        }}
                      >
                        Delete Extra
                      </RediButton>
                    </RowCenterSp>
                  </>
                )}
              </Case>
            </Switch>
            <RowCenterSp style={{ marginTop: "0.25rem" }}>
              <RediIconButton buttonType={EButtonType.SUCCESS} disabled={isDisabled} iconFt={faFileCircleCheck}>
                Confirm
              </RediIconButton>
              <RediIconButton buttonType={EButtonType.ERROR} iconFt={faBan}>
                Cancel
              </RediIconButton>
            </RowCenterSp>
          </Form>
        </Default>
      </Switch>
      {/* <Form.Item style={{ fontWeight: 700 }} key={name} name={name} label={label} rules={rules}></Form.Item> */}
    </SpacingDiv5X>
  );
};

export default FoodForm;
