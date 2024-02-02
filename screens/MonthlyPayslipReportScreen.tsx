import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import PayslipStyle from "../styles/PayslipStyle.scss";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-native";
import moment from "moment";
import { moderateScale } from "../ Metrics";
import { useQuery } from "@apollo/client";
import { GETPAYROLLBYID } from "../graphql/GetPayrollById";
import {
  fetchDataLocalStorage,
  initMobileUserLogin,
} from "../functions/FetchDataLocalStorage";
import { useTranslation } from "react-multi-lang";

export default function MonthlyPayslipReportScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dimension } = useContext(AuthContext);
  const scrollViewRef = useRef<ScrollView>(null);
  const [eye, setEye] = useState(false);
  const [mobileUserLogin, setMobileUserLogin] = useState(initMobileUserLogin);
  const [receive, setReceive] = useState<any>([]);
  const [deduct, setDeduct] = useState<any>([]);
  const id = location.state;
  const t = useTranslation();

  const { data, refetch } = useQuery(GETPAYROLLBYID, {
    pollInterval: 2000,
    variables: {
      id: id,
    },
    onCompleted: ({ getPayrollById }) => {
      let ArrayRecieve: any[] = [];
      let ArrayDeduct: {
        title: any;
        day: number;
        hour: number;
        amount: number;
      }[] = [];

      //================  Company Owe ==========
      if (getPayrollById?.recentPayrollOwe?.length > 0) {
        getPayrollById?.recentPayrollOwe?.map((rowall: any) => {
          let object = {
            title: "Salary on " + rowall?.month,
            day: 0,
            hour: 0,
            amount: rowall?.remain,
          };
          ArrayRecieve.push(object);
        });
      }

      if (getPayrollById?.allowanceList?.length > 0) {
        getPayrollById?.allowanceList?.map((rowall: any) => {
          let object = {
            title: rowall?.allowanceTitle,
            day: 0,
            hour: 0,
            amount: rowall?.totalAmount,
          };
          ArrayRecieve.push(object);
        });
      }

      //==================  Overtime ================
      if (getPayrollById?.overtime?.length > 0) {
        getPayrollById?.overtime?.map((rowall: any) => {
          let object = {
            title: rowall?.overtimeTitle,
            day: rowall?.overtimeDay ? rowall?.overtimeDay : 0,
            hour: rowall?.overtimeHour ? rowall?.overtimeHour : 0,
            amount: rowall?.overtimeAmount,
          };
          ArrayRecieve.push(object);
        });
      }

      //==================  Bonus ================
      if (getPayrollById?.bonus?.length > 0) {
        getPayrollById?.bonus?.map((rowall: any) => {
          let object = {
            title: rowall?.bonusTitle,
            day: rowall?.bonusDay ? rowall?.bonusDay : 0,
            hour: rowall?.bonusHour ? rowall?.bonusHour : 0,
            amount: rowall?.bonusAmount,
          };
          ArrayRecieve.push(object);
        });
      }

      //==================  TimeOff  ================
      if (getPayrollById?.timeOffList?.length > 0) {
        getPayrollById?.timeOffList?.map((rowall: any) => {
          let object = {
            title: rowall?.timeOffTitle,
            day: rowall?.day,
            hour: 0,
            amount: 0,
          };
          ArrayRecieve.push(object);
        });
      }

      //==================  withholding  ================
      if (getPayrollById?.withHoldingList?.length > 0) {
        getPayrollById?.withHoldingList?.map((rowall: any) => {
          let object = {
            title: rowall?.withHoldingTitle,
            day: 0,
            hour: 0,
            amount: rowall?.amount,
          };
          ArrayDeduct.push(object);
        });
      }

      if (getPayrollById?.late) {
        let object = {
          title: "ចូលធ្វើការយីត/ចេញលឿន",
          day: 0,
          hour: 0,
          amount: getPayrollById?.late,
        };
        ArrayDeduct.push(object);
      }

      //======== set array =============
      setReceive([...ArrayRecieve]);
      setDeduct([...ArrayDeduct]);
    },
  });
  useMemo(() => {
    fetchDataLocalStorage("@mobileUserLogin").then((value) => {
      let mobileUser: string = value;
      let mobileUserLoginData = JSON.parse(mobileUser);
      // console.log(mobileUserLoginData);
      setMobileUserLogin({
        _id: mobileUserLoginData?.user?._id,
        firstName: mobileUserLoginData?.user?.firstName,
        lastName: mobileUserLoginData?.user?.lastName,
        englishName: mobileUserLoginData?.user?.latinName,
        profileImg: mobileUserLoginData?.user?.profileImage,
        role: mobileUserLoginData?.user?.role,
      });
    });
  }, [data]);

  useEffect(() => {
    refetch();
    // console.log(id);
  }, [id]);

  const totalDay = () => {
    let total = data?.getPayrollById?.workingDay;
    if (receive) {
      receive.map((e: any) => {
        if (e !== null) {
          total += e?.day;
        }
      });
    }
    return total;
  };

  const totalHour = () => {
    let total = 0;
    if (receive) {
      receive.map((e: any) => {
        if (e !== null) {
          total += e?.hour;
        }
      });
    }
    return total;
  };

  const totalAmount = () => {
    let total = data?.getPayrollById?.baseSalary;
    if (receive) {
      receive.map((e: any) => {
        if (e !== null) {
          total += e?.amount;
        }
      });
    }
    return total?.toFixed(2);
  };

  const totalDeduct = () => {
    let total =
      data?.getPayrollById?.unpaidLeave * data?.getPayrollById?.salaryPerDay;
    if (receive) {
      deduct.map((e: any) => {
        if (e !== null) {
          total += e?.amount;
        }
      });
    }
    return total?.toFixed(2);
  };

  const totalGrossAmount = () => {
    let total = 0.0;
    let baseSalary = parseFloat(totalAmount());
    let withHolding = parseFloat(totalDeduct());
    total = baseSalary - withHolding;
    return total?.toFixed(2);
  };

  return (
    <View
      style={[
        MeetingStyle.MeetingContainer,
        {
          borderTopWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
        },
      ]}
    >
      <View style={MeetingStyle.MeetingBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/payslip")}
          style={[
            MeetingStyle.MeetingBackButton,
            { padding: moderateScale(15) },
          ]}
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={{
              width: moderateScale(20),
              height: moderateScale(20),
              marginRight: moderateScale(10),
            }}
          />
          <Text
            style={[
              MeetingStyle.MeetingBackButtonTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Payslip")}
            {t("Datail")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={PayslipStyle.MonthlyPayslipBodyContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
          style={{
            width: "100%",
          }}
        >
          <View
            style={[
              PayslipStyle.MonthlyPayslipEmployeeCard,
              {
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                marginBottom: moderateScale(20),
              },
            ]}
          >
            <View
              style={{
                width: "100%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={
                      mobileUserLogin?.profileImg
                        ? { uri: mobileUserLogin?.profileImg }
                        : require("../assets/Images/user.png")
                    }
                    style={{
                      width: moderateScale(80),
                      height: moderateScale(80),
                      marginRight: moderateScale(10),
                      borderRadius: moderateScale(100),
                      borderWidth: moderateScale(1),
                      borderColor: "#177a02",
                    }}
                  />
                </View>
                <View style={{ flex: 2 }}>
                  <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          PayslipStyle.MonthlyPayslipDataBody,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {t("ID No:")}
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text
                        style={[
                          PayslipStyle.MonthlyPayslipGrossBody,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {data?.getPayrollById?.IdNo
                          ? data?.getPayrollById?.IdNo
                          : "--:--"}
                      </Text>
                    </View>
                  </View>

                  <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          PayslipStyle.MonthlyPayslipDataBody,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {t("Name:")}
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text
                        style={[
                          PayslipStyle.MonthlyPayslipGrossBody,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {data?.getPayrollById?.latinName
                          ? data?.getPayrollById?.latinName
                          : "--:--"}{" "}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 2 }}>
                <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipDataBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {t("Designation:")}
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.getPayrollById?.position
                        ? data?.getPayrollById?.position
                        : "--:--"}
                    </Text>
                  </View>
                </View>
                <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipDataBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {t("A/C No:")}
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.getPayrollById?.bankNumber
                        ? data?.getPayrollById?.bankNumber
                        : "--:--"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              PayslipStyle.MonthlyPayslipEmployeeCard,
              {
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                marginBottom: moderateScale(20),
              },
            ]}
          >
            <View style={{ flex: 2 }}>
              <View
                style={[
                  PayslipStyle.MonthlyPayslipGrossSalaryEmployeeContentCard,
                  {
                    padding: moderateScale(10),
                    borderRadius: moderateScale(10),
                  },
                ]}
              >
                <Text
                  style={[
                    PayslipStyle.MonthlyPayslipGrossTitle,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {t("Gross Salary")}
                </Text>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {eye ? (
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossSalaryTitle,
                        {
                          height: 30,
                          fontSize: moderateScale(14),
                        },
                      ]}
                    >
                      ${totalGrossAmount()}
                    </Text>
                  ) : (
                    <Image
                      resizeMode="repeat"
                      source={require("../assets/Images/censored.jpeg")}
                      style={{
                        height: moderateScale(30),
                        width: moderateScale(80),
                        paddingRight: moderateScale(10),
                      }}
                    />
                  )}

                  <TouchableOpacity onPress={() => setEye(!eye)}>
                    <Image
                      source={
                        eye
                          ? require("../assets/Images/view.png")
                          : require("../assets/Images/hide.png")
                      }
                      style={
                        dimension === "sm"
                          ? {
                              width: moderateScale(20),
                              height: moderateScale(20),
                            }
                          : {
                              width: moderateScale(25),
                              height: moderateScale(25),
                            }
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flex: 3 }}>
              <View style={PayslipStyle.MonthlyPayslipGrossEmployeeContentCard}>
                <Text
                  style={[
                    PayslipStyle.MonthlyPayslipDataBody,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {t("Payslip For Month")}
                </Text>
                <Text
                  style={[
                    PayslipStyle.MonthlyPayslipGrossTitle,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {t("of")}{" "}
                  {data?.getPayrollById?.date
                    ? moment(data?.getPayrollById?.date).format("MMM YYYY")
                    : "--:--"}
                </Text>
              </View>
              <View style={PayslipStyle.MonthlyPayslipGrossEmployeeContentCard}>
                <Text
                  style={[
                    PayslipStyle.MonthlyPayslipDataBody,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {" "}
                  {t("Date:")}{" "}
                </Text>
                <Text
                  style={[
                    PayslipStyle.MonthlyPayslipGrossBody,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {data?.getPayrollById?.date
                    ? moment(data?.getPayrollById?.date).format("Do, MMM YYYY")
                    : "--:--"}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              PayslipStyle.MonthlyPayslipEmployeeCard,
              {
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                marginBottom: moderateScale(20),
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Salary")}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Days")}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Hours")}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Amount")}
                  </Text>
                </View>
              </View>

              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossBody,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    Salary-Regular Day
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossBody,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {data?.getPayrollById?.workingDay
                      ? data?.getPayrollById?.workingDay
                      : "--:--"}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossBody,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {"--"}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossBody,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {data?.getPayrollById?.baseSalary
                      ? data?.getPayrollById?.baseSalary?.toFixed(2)
                      : "--:--"}
                  </Text>
                </View>
              </View>
              {receive.map((data: any, index: number) => (
                <View
                  style={PayslipStyle.MonthlyPayslipEmployeeContentCard}
                  key={index}
                >
                  <View style={{ flex: 2 }}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.title ? data?.title : "--"}
                    </Text>
                  </View>
                  <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.day ? data?.day : "--"}
                    </Text>
                  </View>
                  <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.hour ? data?.hour : "--"}
                    </Text>
                  </View>
                  <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.amount ? data?.amount?.toFixed(2) : "--"}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("TOTAL")}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {totalDay()}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {totalHour()}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    ${totalAmount()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              PayslipStyle.MonthlyPayslipEmployeeCard,
              {
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                marginBottom: moderateScale(20),
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Withholding")}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Amount")}
                  </Text>
                </View>
              </View>

              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossBody,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    ឈប់សំរាកគ្មានបៀវត្ស/UL ({data?.getPayrollById?.unpaidLeave}
                    d)
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossBody,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {(
                      data?.getPayrollById?.unpaidLeave *
                      data?.getPayrollById?.salaryPerDay
                    )?.toFixed(2)}
                  </Text>
                </View>
              </View>

              {deduct.map((data: any, index: number) => (
                <View
                  style={PayslipStyle.MonthlyPayslipEmployeeContentCard}
                  key={index}
                >
                  <View style={{ flex: 2 }}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.title}
                    </Text>
                  </View>
                  <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossBody,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {data?.amount}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("TOTAL")}
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text
                    style={[
                      PayslipStyle.MonthlyPayslipGrossTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    ${totalDeduct()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
