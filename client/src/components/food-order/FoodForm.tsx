/* eslint-disable @next/next/no-img-element */
import { faBan, faFileCircleCheck, faFilePen, faSquarePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Form, Modal, Select } from "antd";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Case, Default, Else, If, Switch, Then } from "react-if";
import { IFoodApi } from "../../../redifood-module/src/interfaces";
import { GREY, ORANGE_DARK } from "../../constants";
import { useFood } from "../../contexts/food.context";
import { convertFoodToSection } from "../../functions/food.fn";
import { capitalize } from "../../functions/global.fn";
import useCurrency from "../../hooks/useCurrency.hook";
import { EButtonType, IFormInterface } from "../../interfaces";
import { SpacingDiv5X } from "../../styles/styledComponents/div.styled";
import { RedSpan } from "../../styles/styledComponents/span.styled";
import {
  CenteredP,
  CenteredTitle,
  LabelFormBlack,
  LabelFormBlue,
  LabelFormRed,
  RoundedInput,
  RoundedInputNum,
} from "../../styles/styledComponents/typography.styled";
import { RediButton, RediIconButton } from "../styling/Button.style";
import { RowCenter, RowCenterSp } from "../styling/grid.styled";
import RediRadioButton, { Booleanish } from "../styling/RediRadioButton";
const { Option } = Select;
interface IFoodForm {
  foodSection: string[];
  foodList: IFoodApi[];
}

type PartialFood = Partial<IFoodApi> | null;

enum EHandleType {
  NONE = "NONE",
  CREATE = "CREATE",
  EDIT = "EDIT",
  ADDSECTION = "ADDSECTION",
  DELETESECTION = "DELETESECTION",
  ADDEXTRA = "ADDEXTRA",
  DELETEEXTRA = "DELETEEXTRA",
}
// const getBase64 = (img: RcFile, callback: (url: string) => void) => {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result as string));
//   reader.readAsDataURL(img);
// };

// const beforeUpload = (file: RcFile) => {
//   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//   if (!isJpgOrPng) {
//     message.error("You can only upload JPG/PNG file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   return isJpgOrPng && isLt2M;
// };

const FoodForm = ({ foodSection, foodList }: IFoodForm) => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    foodOrder,
    setFoodOrder,
    functions: { selectFood },
  } = useFood();
  const { displayCurrency, convertPrice } = useCurrency();
  const [form] = Form.useForm();
  const pictureSize = 150;
  const pictureValue = Form.useWatch("itemPhoto", form);
  const sectionValue = Form.useWatch("itemSection", form);
  const extraValue = Form.useWatch("itemExtra", form);
  const [editMode, setEditMode] = useState<Booleanish>("true");

  const foodRadioOptions = [
    { label: t("buttons.edit"), value: "true", icon: <FontAwesomeIcon icon={faFilePen} />, ariaLabel: "EDIT" },
    { label: t("buttons.create"), value: "false", icon: <FontAwesomeIcon icon={faSquarePlus} />, ariaLabel: "CREATE" },
  ];

  const initialFormValues: PartialFood = {
    itemName: undefined,
    itemPrice: undefined,
    itemSection: EHandleType.NONE,
    itemExtra: EHandleType.NONE,
    itemPhoto: undefined,
    itemDescription: undefined,
    itemQuantity: undefined,
    itemId: undefined,
  };

  const [handleType, setHandleType] = useState<EHandleType>(EHandleType.NONE);
  const [sortedFood, setSortedFood] = useState<Record<string, string[]>>({});

  const [newFoodData, setNewFoodData] = useState<IFoodApi | null>(null);
  const [inputSection, setInputSection] = useState<string>("");
  const [delSection, setDelSection] = useState<string>("");
  const [inputExtra, setInputExtra] = useState<string>("");
  const [delExtra, setDelExtra] = useState<string>("");
  const [error, setError] = useState(false);

  const [files, setFiles] = useState<any[]>([]);

  const [confirmModal, setConfirmModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const [currentFood, setCurrentFood] = useState<PartialFood>(foodOrder[0]);
  // const [modifiedFood, setModifiedFood] = useState<PartialFood>(null);
  // const {
  //   res: resImage,
  //   doRequest: doRequestUpload,
  //   loading: uploading,
  // } = useRequest<string>({
  //   url: "/api/upload",
  //   method: "post",
  //   body: {
  //     files,
  //   },
  //   queryParams: {},
  // });

  // const { res: resData, doRequest: refreshData } = useRequest<{foodList: IFoods[], foodSection: string[]}>({
  //   url: "/api/food/alter",
  //   method: "post",
  //   body: { newSection: inputSection },
  //   queryParams: {},
  // });
  // const { res: resAddSection, doRequest: doRequestAddSection } = useRequest<{result: true}>({
  //   url: "/api/food/add-section",
  //   method: "post",
  //   body: { newSection: inputSection },
  //   queryParams: {},
  // });
  // const { res: resDelSection, doRequest: doRequestDelSection } = useRequest<{result: true}>({
  //   url: "/api/food/add-section",
  //   method: "post",
  //   body: { deletedSection: delSection },
  //   queryParams: {},
  // });
  // const { res: resAddExtra, doRequest: doRequestAddExtra } = useRequest<{result: true}>({
  //   url: "/api/food/add-extra",
  //   method: "post",
  //   body: { newExtra: addSection },
  //   queryParams: {},
  // });
  // const { res: resDelExtra, doRequest: doRequestDelExtra } = useRequest<{result: true}>({
  //   url: "/api/food/delete-extra",
  //   method: "post",
  //   body: { deletedExtra: delExtra },
  //   queryParams: {},
  // });
  // const { res: resCreate, doRequest: doRequestCreate} = useRequest<{result: true}>({
  //   url: "/api/food/create",
  //   method: "post",
  //   body: fromData,
  //   queryParams: {},
  // });

  const isDisabled =
    sectionValue === EHandleType.NONE ||
    sectionValue === EHandleType.ADDSECTION ||
    sectionValue === EHandleType.DELETESECTION ||
    extraValue === EHandleType.NONE ||
    extraValue === EHandleType.ADDEXTRA ||
    extraValue === EHandleType.DELETEEXTRA
      ? true
      : false;

  const styleNoM = { margin: 0 };
  const optionsCreateFood = (fn: Function): IFormInterface[] => [
    // {
    //   label: "Picture",
    //   name: "itemPhoto",
    //   component: <RoundedInput style={styleNoM} />,
    //   rules: [{ required: true, message: "A picture is required" }],
    // },
    {
      label: t("foods.form-label.name"),
      name: "itemName",
      component: (
        <RoundedInput
          maxLength={30}
          placeholder={t("foods.form-label.name") as string}
          style={styleNoM}
          aria-label="itemName"
        />
      ),
      rules: [{ required: true, message: t("foods.form-label.rules-name") }],
    },
    {
      label: t("foods.form-label.description"),
      name: "itemDescription",
      component: (
        <RoundedInput
          maxLength={40}
          placeholder={t("foods.form-label.description") as string}
          style={styleNoM}
          aria-label="itemDescription"
        />
      ),
      rules: [{ required: false, message: t("foods.form-label.rules-description") }],
    },
    {
      label: t("foods.form-label.price"),
      name: "itemPrice",
      component: (
        <RoundedInputNum
          placeholder={t("foods.form-label.price") as string}
          addonAfter={fn()}
          style={styleNoM}
          aria-label="itemPrice"
        />
      ),
      rules: [{ required: true, message: t("foods.form-label.rules-price") }],
    },
  ];

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/.jpg" as any,
    minSize: 0,
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setFiles(
        acceptedFiles?.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ) as any,
      );
      const formData = new FormData();

      // This is working for now
      formData.append("file", acceptedFiles[0]);
      console.log("acc", acceptedFiles);
      // formData.append("upload_preset", String(process.env.NEXT_PUBLIC_UPLOAD_PRESET));
      // const response = await axios.post(
      //   `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      //   formData,
      // );
      // const { statusText, data } = response;
      // console.log(data.secure_url);
      // if (statusText === "OK") {
      // return setUrlFile(data.secure_url);
      // }
    },
  });

  const checkFood = () => {
    if (editMode === "true") {
      return currentFood === newFoodData;
    } else {
      return foodOrder[0] === form.getFieldsValue();
    }
  };

  const handleCancel = () => {
    if (handleType === EHandleType.ADDSECTION || handleType === EHandleType.DELETESECTION) {
      setInputSection("");
      setDelSection("");
      form.setFieldsValue({ itemSection: foodOrder[0].itemSection });
    } else if (handleType === EHandleType.ADDEXTRA || handleType === EHandleType.DELETEEXTRA) {
      setInputExtra("");
      setDelExtra("");
      form.setFieldsValue({ itemExtra: foodOrder[0].itemExtra });
    } else if (handleType === EHandleType.EDIT) {
      form.setFieldsValue(foodOrder[0]);
    } else {
      form.setFieldsValue({});
    }
  };

  const onFinish = (values: any) => {
    console.log("validated");
    if (files.length === 0) {
      return setError(true);
    }
    setError(false);
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
    handleCancel();
  };

  // const beforeUpload = (file: RcFile) => {
  //   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  //   if (!isJpgOrPng) {
  //     message.error("You can only upload JPG/PNG file!");
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error("Image must smaller than 2MB!");
  //   }
  //   return isJpgOrPng && isLt2M;
  // };

  useEffect(() => {
    if (editMode === "true" && foodOrder.length !== 0) {
      console.log("fdp", foodOrder[0]);
      setCurrentFood(foodOrder[0]);
      form.setFieldsValue({
        itemQuantity: 0,
        itemName: foodOrder[0].itemName,
        itemDescription: foodOrder[0].itemDescription,
        itemPrice: convertPrice(foodOrder[0].itemPrice, "backToFront", false),
        itemPhoto: foodOrder[0].itemPhoto,
        itemSection: foodOrder[0].itemSection,
        itemExtra: foodOrder[0].itemExtra,
      });
      setFiles([foodOrder[0].itemPhoto]);
      setSortedFood(convertFoodToSection(foodList, foodSection));
    } else {
      setFiles([]);
      form.setFieldsValue(initialFormValues);
      setCurrentFood(initialFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFood, editMode]);
  return (
    <>
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
            setFoodOrder([]);
            form.setFieldsValue({
              itemPhoto: "",
              itemName: "",
              itemPrice: "",
              itemDescription: "",
              itemSection: EHandleType.NONE,
              itemExtra: EHandleType.NONE,
            });
          }}
        />
        <Switch>
          <Case condition={editMode === "true" && foodOrder.length === 0}>
            <Alert
              type="warning"
              style={{ fontWeight: 700, height: "80vh", textAlign: "center", fontSize: "1rem", marginTop: "1.5rem" }}
              message={t("foods.alert-no-food")}
              aria-label="Please select a food to update"
            />
          </Case>
          <Default>
            <If condition={files.length === 0}>
              <Then>
                <RowCenter style={{ margin: "1rem 0" }}>
                  <div
                    style={{ border: `1px solid ${ORANGE_DARK}`, width: "100%", borderRadius: "2rem" }}
                    {...getRootProps()}
                  >
                    <input
                      aria-label="Drop a file here"
                      name="file"
                      placeholder={t('foods.form-label."upload-file-placeholder"') as string}
                      type="file"
                      {...getInputProps()}
                    />
                    <CenteredP>{t("foods.form-label.drop-file")}</CenteredP>
                  </div>
                </RowCenter>
              </Then>
              <Else>
                <RowCenter style={{ marginTop: "1rem" }}>
                  {pictureValue && (
                    <Image
                      height={pictureSize}
                      width={pictureSize}
                      style={{ borderRadius: "50%", border: `1px dashed ${GREY}`, margin: "0 auto 1rem" }}
                      src={pictureValue}
                      alt="new food picture"
                    />
                  )}
                </RowCenter>

                <RowCenter>
                  <RediIconButton
                    iconFt={faXmark}
                    buttonType={EButtonType.ERROR}
                    aria-label="Remove file"
                    onClick={() => {
                      setFiles([]);
                      form.setFieldValue("itemPhoto", "");
                    }}
                    // loading={uploading}
                  >
                    {t("buttons.remove-file")}
                  </RediIconButton>
                </RowCenter>
              </Else>
            </If>
            {error && <Alert type="error" message={t("foodSection.form-label.rules-picture")} />}

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
              <Form.Item style={{ display: "none" }} name="itemPhoto" />
              {optionsCreateFood(displayCurrency)?.map(({ label, name, component, rules }: IFormInterface) => {
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
                {t("foods.form-label.section")} <RedSpan>*</RedSpan>
              </LabelFormBlack>
              <Form.Item name="itemSection" id="itemSection" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                <Select
                  style={{ borderRadius: "2rem" }}
                  onChange={() => {
                    form.setFieldValue("itemExtra", EHandleType.NONE);
                  }}
                >
                  <Option value={EHandleType.NONE}>{t("foods.form-label.select")}</Option>
                  {foodSection &&
                    foodSection.map((section, index) => (
                      <Option key={index} value={section}>
                        {capitalize(section)}
                      </Option>
                    ))}
                  <Option value={EHandleType.ADDSECTION}>{t("foods.form-label.add-section")}</Option>
                  <Option value={EHandleType.DELETESECTION}>{t("foods.form-label.delete-section")}</Option>
                </Select>
              </Form.Item>
              <Switch>
                <Case condition={sectionValue === EHandleType.ADDSECTION}>
                  <>
                    <LabelFormBlue>{t("foods.form-label.create-new-section")}</LabelFormBlue>
                    <RowCenterSp>
                      <RoundedInput value={inputSection} onChange={(e) => setInputSection(e.target.value)} />
                      <RediButton
                        buttonType={EButtonType.CREATE}
                        disabled={inputSection === "" ? true : false}
                        onClick={() => {
                          // ViewSectionModel
                          setHandleType(EHandleType.ADDSECTION);
                          setConfirmModal(true);
                        }}
                      >
                        {t("foods.form-label.create-section")}
                      </RediButton>
                    </RowCenterSp>
                  </>
                </Case>
                <Case condition={sectionValue === EHandleType.DELETESECTION}>
                  <>
                    <LabelFormRed>{t("foods.form-label.delete-current-section")}</LabelFormRed>
                    <RowCenterSp>
                      <Select value={delSection} style={{ marginBottom: "0.5rem" }} onChange={(e) => setDelSection(e)}>
                        <Option value={EHandleType.NONE}>Select ...</Option>
                        {Object.keys(sortedFood)?.map((section, index) => (
                          <Option key={index} value={section}>
                            {capitalize(section)}
                          </Option>
                        ))}
                      </Select>
                      <RediButton
                        aria-label="Delete section"
                        buttonType={EButtonType.ERROR}
                        style={{ marginTop: "0.5rem" }}
                        disabled={delSection === "" || delSection === "all" ? true : false}
                        onClick={() => {
                          // ViewSectionModel
                          setHandleType(EHandleType.DELETESECTION);
                          setConfirmModal(true);
                        }}
                      >
                        {t("foods.form-label.delete-section")}
                      </RediButton>
                    </RowCenterSp>
                  </>
                </Case>
                <Case condition={sectionValue !== "all" && sectionValue !== EHandleType.NONE}>
                  <>
                    <LabelFormBlack htmlFor="itemExtra">
                      {t("foods.form-label.extra")} <RedSpan>*</RedSpan>
                    </LabelFormBlack>
                    <Form.Item name="itemExtra" id="itemExtra" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                      <Select>
                        <Option value={EHandleType.NONE}> {t("foods.form-label.select")}</Option>
                        {sortedFood[sectionValue]?.map((extra, index) => (
                          <Option key={index} value={extra}>
                            {capitalize(extra)}
                          </Option>
                        ))}
                        <Option value={EHandleType.ADDEXTRA}>{t("foods.form-label.add-extra")}</Option>
                        <Option value={EHandleType.DELETEEXTRA}>{t("foods.form-label.delete-extra")}</Option>
                      </Select>
                    </Form.Item>
                  </>
                  {extraValue === EHandleType.ADDEXTRA && (
                    <>
                      <LabelFormBlue>{t("foods.form-label.create-new-extra")}</LabelFormBlue>
                      <RowCenterSp>
                        <RoundedInput value={inputExtra} onChange={(e) => setInputExtra(e.target.value)} />
                        <RediButton
                          buttonType={EButtonType.CREATE}
                          disabled={inputExtra === "" ? true : false}
                          onClick={() => {
                            // ViewExtraModel
                            setHandleType(EHandleType.ADDEXTRA);
                            setConfirmModal(true);
                          }}
                        >
                          {t("foods.form-label.create-extra")}
                        </RediButton>
                      </RowCenterSp>
                    </>
                  )}
                  {extraValue === EHandleType.DELETEEXTRA && (
                    <>
                      <LabelFormRed>{t("foods.form-label.delete-current-extra")}</LabelFormRed>
                      <RowCenterSp style={{ marginBottom: 0 }}>
                        <Select value={delExtra} onChange={(e) => setDelExtra(e)}>
                          <Option value="">{t("foods.form-label.select")}</Option>
                          {sortedFood[sectionValue]?.map((section, index) => (
                            <Option key={index} value={section}>
                              {capitalize(section)}
                            </Option>
                          ))}
                        </Select>
                        <RediButton
                          aria-label="Delete extra"
                          buttonType={EButtonType.ERROR}
                          disabled={delExtra === "" ? true : false}
                          onClick={() => {
                            // ViewExtraModel
                            setHandleType(EHandleType.DELETEEXTRA);
                            setConfirmModal(true);
                          }}
                        >
                          {t("foods.form-label.delete-extra")}
                        </RediButton>
                      </RowCenterSp>
                    </>
                  )}
                </Case>
              </Switch>
              <RowCenterSp style={{ marginTop: "1rem" }}>
                <RediIconButton
                  buttonType={EButtonType.SUCCESS}
                  disabled={isDisabled}
                  iconFt={faFileCircleCheck}
                  onClick={() => {
                    if (editMode === "true") {
                      setHandleType(EHandleType.EDIT);
                    } else {
                      setHandleType(EHandleType.CREATE);
                    }
                    setConfirmModal(true);
                  }}
                >
                  {t("buttons.confirm")}
                </RediIconButton>
                <RediIconButton
                  buttonType={EButtonType.ERROR}
                  iconFt={faBan}
                  onClick={() => {
                    if (checkFood()) {
                      router.replace("/");
                    } else {
                      setCancelModal(true);
                    }
                  }}
                >
                  {t("buttons.cancel")}
                </RediIconButton>
              </RowCenterSp>
            </Form>
          </Default>
        </Switch>
      </SpacingDiv5X>
      <Modal
        open={confirmModal}
        onCancel={() => setConfirmModal((prevValue: boolean) => !prevValue)}
        onOk={() => form.submit()}
      >
        <Switch>
          <Case condition={handleType === EHandleType.ADDSECTION}>Do you want to create {inputSection} section ?</Case>
          <Case condition={handleType === EHandleType.DELETESECTION}>
            <>
              <p>Do you want to delete {delSection} section ?</p>
              <p>These foods will be deleted</p>
              {foodList &&
                foodList
                  .filter((food) => {
                    return food.itemSection === delSection;
                  })
                  .map((food: IFoodApi) => {
                    return <p key={food.itemId}>{food.itemName}</p>;
                  })}
            </>
          </Case>
          <Case condition={handleType === EHandleType.ADDEXTRA}>Do you want to create {inputExtra} section ?</Case>
          <Case condition={handleType === EHandleType.DELETEEXTRA}>
            <>
              <p>Do you want to delete {delExtra} extra ?</p>
              <p>These foods will be deleted</p>
              {foodList &&
                foodList
                  .filter((food) => food.itemExtra === delExtra)
                  .map((food: IFoodApi) => {
                    return <p key={food.itemId}>{food.itemName}</p>;
                  })}
            </>
          </Case>
        </Switch>
      </Modal>
      <Modal
        open={cancelModal}
        onCancel={() => setCancelModal((prevValue: boolean) => !prevValue)}
        onOk={() => router.refresh()}
      >
        <CenteredTitle level={4}>Are you sure to cancel ?</CenteredTitle>
      </Modal>
    </>
  );
};

export default FoodForm;
