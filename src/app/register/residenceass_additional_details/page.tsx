"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import NavigationBar from "@/components/navigationBar";
import Footer from "@/components/footer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const formSchema = z.object(
  {
    "country":z.string(),
    "state":z.string(),
    "district":z.string(),
    "lsgdzone":z.string().max(255),
    "total_team":z.coerce.number(),
  })

export default function ResidenceAssAdditionalDetails() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [category, setCategory] = useState([]);
  const [lsgd, setLsgd] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  
  useEffect(() => {
    async function fetchData() {
      const countryResponse = await fetch("http://localhost:3000/api/v1/country");
      const countryData = await countryResponse.json();
      setCountries(countryData.country);

      const stateResponse = await fetch("http://localhost:3000/api/v1/state");
      const stateData = await stateResponse.json();
      setStates(stateData.state);

      const districtResponse = await fetch("http://localhost:3000/api/v1/district");
      const districtData = await districtResponse.json();
      setDistricts(districtData.district);

      const categoryResponse = await fetch("http://localhost:3000/api/v1/category");
      const categoryData = await categoryResponse.json();
      setCategory(categoryData.category);
    }
    fetchData();
  }, []);

  
  useEffect(() => {
    async function fetchLsgdData() {
      if (selectedDistrict) {
        console.log(selectedDistrict);
        const lsgResponse = await fetch(`http://localhost:3000/api/v1/lsg/${selectedDistrict}`);
        const lsgData = await lsgResponse.json();
        setLsgd(lsgData.district);
      }
    }
    fetchLsgdData();
  }, [selectedDistrict]);

  
// get group id from the url parameter
const searchParams = useSearchParams();

const group_id = searchParams.get("group_id");

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  console.log(values);
  const dataWithIds = {
    countryId : countries.find((item) => item.cntry_name === values.country)?.cntry_id,
    stateId : states.find((item) => item.st_name === values.state)?.st_id,
    districtId : districts.find((item) => item.dis_name === values.district)?.dis_id,
    lsgdId : lsgd.find((item) => item.lsg_name === values.lsgdzone)?.lsg_id,
    totalNoOfMembers : values.total_team,
    groupId: parseInt(group_id),
   

  };
  console.log(dataWithIds);

  try {
    const response = await fetch("http://localhost:3000/api/v1/group/residence_association/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataWithIds),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log(result);
    
    // router.push("/register/promoter-additional-details?group_id=" + group_id);
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <section className="bg-green-50 dark:bg-gray-900">
      <NavigationBar />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 mt-8">
        {/* <h1 className="flex items-center my-6 text-2xl font-bold text-green-600 dark:text-white">
          GreenCleanEarth
        </h1> */}
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Residence Association - Additional details
              </h1>
          <Form {...form}>
            <form  noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  {countries.map((country) => (
                            <SelectItem key={country.cntry_id} value={country.cntry_name}>
                              {country.cntry_name}
                            </SelectItem>
                          ))}
                                    <SelectItem value="other">Other</SelectItem>

                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />             
                    <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  {states.map((state) => (
                            <SelectItem key={state.st_id} value={state.st_name}>
                              {state.st_name}

                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />  


                    <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District</FormLabel>
                                <Select onValueChange={(value) => {
                                    form.setValue("district", value);
                                    value = districts.find((item) => item.dis_name === value)?.dis_id
                                    setSelectedDistrict(value);
                                  }} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose district" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  {districts.map((district) => (
                            <SelectItem key={district.dis_id} value={district.dis_name}>
                              {district.dis_name}
                            </SelectItem>
                          ))}
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                  
                    <FormField
                            control={form.control}
                            name="lsgdzone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LSGD / Zone</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose Zone" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  { lsgd && lsgd.map((lsg) => (
                                          <SelectItem key={lsg.lsg_id} value={lsg.lsg_name}>
                                            {lsg.lsg_name}
                                          </SelectItem>
                                        ))}
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                  
                  <FormField
                    control={form.control}
                    name="total_team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total number of team members</FormLabel>
                        <FormControl>
                          <Input  type="number" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              <Button type="submit" className="bg-green-600">Submit</Button>
            </form>
          </Form>
    </div>
      </div>
  </div>
  <Footer/>
</section>
  )
}