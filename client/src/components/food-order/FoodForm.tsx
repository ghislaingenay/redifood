/* eslint-disable @next/next/no-img-element */
import { faBan, faFileCircleCheck, faFilePen, faSquarePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Form, Modal, Select } from "antd";
import axios from "axios";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Case, Default, Else, If, Switch, Then } from "react-if";
import { toast } from "react-toastify";
import { AxiosFunction } from "../../../pages/api/axios-request";
import {
  handleCreateExtra,
  handleCreateFood,
  handleCreateSection,
  handleDeleteExtra,
  handleDeleteSection,
  handleUpdatedFood,
} from "../../../pages/api/food-api";
import {
  IFoodApi,
  IFoodGetApi,
  IFoodSectionListWithExtra,
  IGetSectionInfo,
} from "../../../redifood-module/src/interfaces";
import { GREY, ORANGE_DARK, initialFormValues } from "../../constants";
import { useFood } from "../../contexts/food.context";
import {
  checkDisability,
  formDataToFood,
  getDataBySectionId,
  initializeDataForFoodForm,
  recoverIdName,
} from "../../functions/food.fn";
import { capitalize } from "../../functions/global.fn";
import useCurrency from "../../hooks/useCurrency.hook";
import { EButtonType, EHandleType, IFormInterface } from "../../interfaces";
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
import RediRadioButton, { Booleanish } from "../styling/RediRadioButton";
import { RowCenter, RowCenterSp } from "../styling/grid.styled";
const { Option } = Select;

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

const FoodForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    foodOrder,
    setFoodOrder,
    functions: { selectFood },
  } = useFood();
  const { displayCurrency, convertPrice } = useCurrency();

  const [form] = Form.useForm();
  const pictureValue = Form.useWatch("itemPhoto", form);
  const sectionValue = Form.useWatch("itemSection", form);
  const extraValue = Form.useWatch("itemExtra", form);

  const PICTURE_SIZE = 150;
  const styleNoM = { margin: 0 };
  const foodRadioOptions = [
    { label: t("buttons.edit"), value: "true", icon: <FontAwesomeIcon icon={faFilePen} />, ariaLabel: "EDIT" },
    { label: t("buttons.create"), value: "false", icon: <FontAwesomeIcon icon={faSquarePlus} />, ariaLabel: "CREATE" },
  ];

  const [editMode, setEditMode] = useState<Booleanish>("true");
  const switchMode = editMode === "true" ? "false" : "true";
  const isEditModeWithoutFood = editMode === "true" && foodOrder.length === 0;

  const isDeleteExtraMode = extraValue === EHandleType.DELETEEXTRA;
  const isAddExtraMode = extraValue === EHandleType.ADDEXTRA;
  const isDeleteSectionMode = sectionValue === EHandleType.DELETESECTION;
  const isAddSectionMode = sectionValue === EHandleType.ADDSECTION;

  const relatedToSectionAndExtra = isDeleteExtraMode || isAddExtraMode || isDeleteSectionMode || isAddSectionMode;
  const isCreateNewFood = editMode === "false" && !relatedToSectionAndExtra;
  const isEditFood = editMode === "true" && !relatedToSectionAndExtra;

  const [sectionIdName, setSectionIdName] = useState<{ id: number; name: string }[]>([]);
  const [allFoods, setAllFoods] = useState<IFoodGetApi[]>([]);
  const [listSectionExtra, setListSectionExtra] = useState<IFoodSectionListWithExtra[]>([]);
  const [loading, setLoading] = useState(false);
  const [handleType, setHandleType] = useState<EHandleType>(EHandleType.NONE);
  const [newFoodData, setNewFoodData] = useState<IFoodApi | null>(null);
  const [inputSection, setInputSection] = useState<string>("");
  const [delSection, setDelSection] = useState<string>("");
  const [inputExtra, setInputExtra] = useState<string>("");
  const [delExtra, setDelExtra] = useState<string>("");
  const [error, setError] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [urlFile, setUrlFile] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const haveFile = files.length !== 0;

  const optionsCreateFood = (fn: Function): IFormInterface[] => [
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
      formData.append("upload_preset", String(process.env.NEXT_PUBLIC_UPLOAD_PRESET));
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        formData,
      );
      const { statusText, data } = response;
      console.log(data.secure_url);
      if (statusText === "OK") {
        return setUrlFile(data.secure_url);
      }
    },
  });

  const handleCancel = () => {
    if (handleType === EHandleType.ADDSECTION || handleType === EHandleType.DELETESECTION) {
      setInputSection("");
      setDelSection("");
      form.setFieldsValue({ itemSection: foodOrder[0].itemSection.id });
    } else if (handleType === EHandleType.ADDEXTRA || handleType === EHandleType.DELETEEXTRA) {
      setInputExtra("");
      setDelExtra("");
      form.setFieldsValue({ itemExtra: foodOrder[0].itemExtra.id });
    } else if (handleType === EHandleType.EDIT) {
      form.setFieldsValue(foodOrder[0]);
    } else {
      form.setFieldsValue({});
    }
    router.refresh();
  };

  const onFinish = async (values: any) => {
    const formattedFoodData = formDataToFood(values);
    if (files.length === 0) return setError(true);
    setError(false);
    switch (handleType) {
      case EHandleType.ADDSECTION: {
        console.log("new section added", inputSection);
        const createdSectionRes = await handleCreateSection(inputSection.toLowerCase(), listSectionExtra);
        if (!createdSectionRes.created) return setConfirmModal(false);
        setInputSection("");
        break;
      }
      case EHandleType.DELETESECTION: {
        console.log("deleted section", delSection);
        const deleteSectionRes = await handleDeleteSection(Number(delSection));
        if (!deleteSectionRes.deleted) return setConfirmModal(false);
        setDelSection("");
        form.setFieldValue("itemSection", EHandleType.NONE);
        break;
      }
      case EHandleType.ADDEXTRA: {
        console.log("created extra", inputExtra);
        const createExtraRes = await handleCreateExtra(inputExtra.toLowerCase(), sectionValue, listSectionExtra);
        if (!createExtraRes.created) return setConfirmModal(false);
        form.setFieldValue("itemExtra", EHandleType.NONE);
        setInputExtra("");
        break;
      }
      case EHandleType.DELETEEXTRA: {
        console.log("deleted extra", delExtra);
        const deleteExtraRes = await handleDeleteExtra(Number(delExtra));
        if (!deleteExtraRes.deleted) return setConfirmModal(false);
        form.setFieldValue("itemExtra", EHandleType.NONE);
        setDelExtra("");
        break;
      }
      default: {
      }
    }
    if (isCreateNewFood) {
      const createdFoodRes = await handleCreateFood(formattedFoodData);
      if (!createdFoodRes.created) return setConfirmModal(false);
    }
    if (isEditFood) {
      const updateRes = await handleUpdatedFood(addAdditionnalFoodInfo(formattedFoodData), foodOrder[0].id);
      if (!updateRes.updated) return setConfirmModal(false);
    }
    handleCancel();
  };

  const getExtraOptions = useMemo(() => {
    if (sectionValue === EHandleType.NONE) return;
    return getDataBySectionId(listSectionExtra, sectionValue as number)?.extraList?.map(({ id, extraName }, index) => (
      <Option key={index} value={id}>
        {capitalize(extraName)}
      </Option>
    ));
  }, [listSectionExtra, sectionValue]);

  const getSectionOptions = sectionIdName?.map(({ id, name }, index) => (
    <Option key={index} value={id}>
      {capitalize(name)}
    </Option>
  ));

  const getDeletedSectionName = delSection && sectionIdName?.find(({ id }) => id === Number(delSection))?.name;
  const getDeletedExtraName = getDataBySectionId(listSectionExtra, sectionValue as number)?.extraList?.find(
    (item) => item.id === Number(delExtra),
  )?.extraName;

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

  const currentFood = useMemo(() => {
    if (editMode === "true" && foodOrder.length !== 0) {
      form.setFieldsValue(initializeDataForFoodForm(foodOrder[0]));
      console.log(form.getFieldsValue());
      setFiles([foodOrder[0].itemPhoto]);
      console.log("foodOrder", foodOrder);
      return foodOrder[0];
    } else {
      setFiles([]);
      form.setFieldsValue(initialFormValues);
      return undefined;
    }
  }, [selectFood, editMode]); // add section list extended from useEffect and add with state

  const addAdditionnalFoodInfo = (food: Omit<IFoodApi, "id" | "userId">): IFoodApi => {
    return (currentFood && { ...food, id: currentFood.id, userId: currentFood.userId }) as IFoodApi;
  };

  useEffect(() => {
    AxiosFunction({
      method: "get",
      url: "api/foods/section/information",
      body: {},
      queryParams: {},
    })
      .then((res: { results: IGetSectionInfo }) => {
        const {
          results: { listing, foods },
        } = res;
        console.log({res})
        setAllFoods(foods);
        setListSectionExtra(listing);
        setSectionIdName(recoverIdName(listing));
      })
      .catch((err) => toast.error(err.message));
  }, []);

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
          clickedFn={() => {
            setFoodOrder([]);
            form.setFieldsValue(initialFormValues);
            setEditMode(switchMode);
          }}
        />
        <Switch>
          <Case condition={isEditModeWithoutFood}>
            <Alert
              type="warning"
              style={{ fontWeight: 700, height: "80vh", textAlign: "center", fontSize: "1rem", marginTop: "1.5rem" }}
              message={t("foods.alert-no-food")}
              aria-label="Please select a food to update"
            />
          </Case>
          <Default>
            <If condition={!haveFile}>
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
                      height={PICTURE_SIZE}
                      width={PICTURE_SIZE}
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
              {optionsCreateFood(displayCurrency)?.map(
                ({ label, name, component, rules }: IFormInterface, index: number) => {
                  return (
                    <div key={index}>
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
                    </div>
                  );
                },
              )}
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
                  {getSectionOptions}
                  <Option value={EHandleType.ADDSECTION}>{t("foods.form-label.add-section")}</Option>
                  <Option value={EHandleType.DELETESECTION}>{t("foods.form-label.delete-section")}</Option>
                </Select>
              </Form.Item>
              <Switch>
                <Case condition={isAddSectionMode}>
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
                <Case condition={isDeleteSectionMode}>
                  <>
                    <LabelFormRed>{t("foods.form-label.delete-current-section")}</LabelFormRed>
                    <RowCenterSp>
                      <Select
                        value={delSection}
                        style={{ marginBottom: "0.5rem", width: "100%" }}
                        onChange={(e) => setDelSection(e)}
                      >
                        <Option value={EHandleType.NONE}>Select ...</Option>
                        {getSectionOptions}
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
                        {getExtraOptions}
                        <Option value={EHandleType.ADDEXTRA}>{t("foods.form-label.add-extra")}</Option>
                        <Option value={EHandleType.DELETEEXTRA}>{t("foods.form-label.delete-extra")}</Option>
                      </Select>
                    </Form.Item>
                  </>
                  {isAddExtraMode && (
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
                  {isDeleteExtraMode && (
                    <>
                      <LabelFormRed>{t("foods.form-label.delete-current-extra")}</LabelFormRed>
                      <RowCenterSp style={{ marginBottom: 0 }}>
                        <Select value={delExtra} onChange={(e) => setDelExtra(e)}>
                          <Option value="">{t("foods.form-label.select")}</Option>
                          {getExtraOptions}
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
                  disabled={checkDisability(sectionValue, extraValue)}
                  iconFt={faFileCircleCheck}
                  onClick={() => {
                    if (editMode === "true") setHandleType(EHandleType.EDIT);
                    else setHandleType(EHandleType.CREATE);
                    setConfirmModal(true);
                  }}
                >
                  {t("buttons.confirm")}
                </RediIconButton>
                <RediIconButton buttonType={EButtonType.ERROR} iconFt={faBan} onClick={() => router.replace("/")}>
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
          <Case condition={isCreateNewFood}>Do you want to confirm new food ?</Case>
          <Case condition={isEditFood}>Do you want to confirm update food ?</Case>
          <Case condition={handleType === EHandleType.ADDSECTION}>Do you want to create {inputSection} section ?</Case>
          <Case condition={handleType === EHandleType.DELETESECTION}>
            <>
              <p>Do you want to delete {getDeletedSectionName} section ?</p>
              <p>These foods will be deleted</p>
              {allFoods &&
                allFoods
                  .filter((food) => {
                    return food.itemSection.id === Number(delSection);
                  })
                  .map((food) => {
                    return <p key={food.id}>{food.itemName}</p>;
                  })}
            </>
          </Case>
          <Case condition={handleType === EHandleType.ADDEXTRA}>Do you want to create {inputExtra} section ?</Case>
          <Case condition={handleType === EHandleType.DELETEEXTRA}>
            <>
              <p>Do you want to delete {getDeletedExtraName} extra ?</p>
              <p>These foods will be deleted</p>
              {allFoods &&
                allFoods
                  .filter((food) => food.itemExtra.id === Number(delExtra))
                  .map((food) => {
                    return <p key={food.id}>{food.itemName}</p>;
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
