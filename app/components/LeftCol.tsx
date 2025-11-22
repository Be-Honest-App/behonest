'use client'

import { useState } from 'react'
// import { useSearchParams, useRouter, usePathname } from 'next/navigation'
// import Filters from './Filters'

export default function LeftCol() {
    const [postText, setPostText] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [category, setCategory] = useState('') // No default; require selection
    const [country, setCountry] = useState('') // No default; require selection
    const [isPosting, setIsPosting] = useState(false)

    // const searchParams = useSearchParams()
    // const router = useRouter()
    // const pathname = usePathname()

    // Map country codes to full names for display
    const getFullCountryName = (code: string): string => {
        const countryNames: Record<string, string> = {
            AF: 'Afghanistan',
            AL: 'Albania',
            DZ: 'Algeria',
            AD: 'Andorra',
            AO: 'Angola',
            AG: 'Antigua and Barbuda',
            AR: 'Argentina',
            AM: 'Armenia',
            AU: 'Australia',
            AT: 'Austria',
            AZ: 'Azerbaijan',
            BS: 'Bahamas',
            BH: 'Bahrain',
            BD: 'Bangladesh',
            BB: 'Barbados',
            BY: 'Belarus',
            BE: 'Belgium',
            BZ: 'Belize',
            BJ: 'Benin',
            BT: 'Bhutan',
            BO: 'Bolivia',
            BA: 'Bosnia and Herzegovina',
            BW: 'Botswana',
            BR: 'Brazil',
            BN: 'Brunei',
            BG: 'Bulgaria',
            BF: 'Burkina Faso',
            BI: 'Burundi',
            CV: 'Cabo Verde',
            KH: 'Cambodia',
            CM: 'Cameroon',
            CA: 'Canada',
            CF: 'Central African Republic',
            TD: 'Chad',
            CL: 'Chile',
            CN: 'China',
            CO: 'Colombia',
            KM: 'Comoros',
            CG: 'Congo (Congo-Brazzaville)',
            CD: 'Congo (Democratic Republic)',
            CR: 'Costa Rica',
            HR: 'Croatia',
            CU: 'Cuba',
            CY: 'Cyprus',
            CZ: 'Czechia',
            DK: 'Denmark',
            DJ: 'Djibouti',
            DM: 'Dominica',
            DO: 'Dominican Republic',
            EC: 'Ecuador',
            EG: 'Egypt',
            SV: 'El Salvador',
            GQ: 'Equatorial Guinea',
            ER: 'Eritrea',
            EE: 'Estonia',
            SZ: 'Eswatini',
            ET: 'Ethiopia',
            FJ: 'Fiji',
            FI: 'Finland',
            FR: 'France',
            GA: 'Gabon',
            GM: 'Gambia',
            GE: 'Georgia',
            DE: 'Germany',
            GH: 'Ghana',
            GR: 'Greece',
            GD: 'Grenada',
            GT: 'Guatemala',
            GN: 'Guinea',
            GW: 'Guinea-Bissau',
            GY: 'Guyana',
            HT: 'Haiti',
            HN: 'Honduras',
            HU: 'Hungary',
            IS: 'Iceland',
            IN: 'India',
            ID: 'Indonesia',
            IR: 'Iran',
            IQ: 'Iraq',
            IE: 'Ireland',
            IL: 'Israel',
            IT: 'Italy',
            JM: 'Jamaica',
            JP: 'Japan',
            JO: 'Jordan',
            KZ: 'Kazakhstan',
            KE: 'Kenya',
            KI: 'Kiribati',
            KP: 'North Korea',
            KR: 'South Korea',
            KW: 'Kuwait',
            KG: 'Kyrgyzstan',
            LA: 'Laos',
            LV: 'Latvia',
            LB: 'Lebanon',
            LS: 'Lesotho',
            LR: 'Liberia',
            LY: 'Libya',
            LI: 'Liechtenstein',
            LT: 'Lithuania',
            LU: 'Luxembourg',
            MG: 'Madagascar',
            MW: 'Malawi',
            MY: 'Malaysia',
            MV: 'Maldives',
            ML: 'Mali',
            MT: 'Malta',
            MH: 'Marshall Islands',
            MR: 'Mauritania',
            MU: 'Mauritius',
            MX: 'Mexico',
            FM: 'Micronesia',
            MD: 'Moldova',
            MC: 'Monaco',
            MN: 'Mongolia',
            ME: 'Montenegro',
            MA: 'Morocco',
            MZ: 'Mozambique',
            MM: 'Myanmar',
            NA: 'Namibia',
            NR: 'Nauru',
            NP: 'Nepal',
            NL: 'Netherlands',
            NZ: 'New Zealand',
            NI: 'Nicaragua',
            NE: 'Niger',
            NG: 'Nigeria',
            MK: 'North Macedonia',
            NO: 'Norway',
            OM: 'Oman',
            PK: 'Pakistan',
            PW: 'Palau',
            PS: 'Palestine',
            PA: 'Panama',
            PG: 'Papua New Guinea',
            PY: 'Paraguay',
            PE: 'Peru',
            PH: 'Philippines',
            PL: 'Poland',
            PT: 'Portugal',
            QA: 'Qatar',
            RO: 'Romania',
            RU: 'Russia',
            RW: 'Rwanda',
            KN: 'Saint Kitts and Nevis',
            LC: 'Saint Lucia',
            VC: 'Saint Vincent and the Grenadines',
            WS: 'Samoa',
            SM: 'San Marino',
            ST: 'Sao Tome and Principe',
            SA: 'Saudi Arabia',
            SN: 'Senegal',
            RS: 'Serbia',
            SC: 'Seychelles',
            SL: 'Sierra Leone',
            SG: 'Singapore',
            SK: 'Slovakia',
            SI: 'Slovenia',
            SB: 'Solomon Islands',
            SO: 'Somalia',
            ZA: 'South Africa',
            SS: 'South Sudan',
            ES: 'Spain',
            LK: 'Sri Lanka',
            SD: 'Sudan',
            SR: 'Suriname',
            SE: 'Sweden',
            CH: 'Switzerland',
            SY: 'Syria',
            TW: 'Taiwan',
            TJ: 'Tajikistan',
            TZ: 'Tanzania',
            TH: 'Thailand',
            TL: 'Timor-Leste',
            TG: 'Togo',
            TO: 'Tonga',
            TT: 'Trinidad and Tobago',
            TN: 'Tunisia',
            TR: 'Turkey',
            TM: 'Turkmenistan',
            TV: 'Tuvalu',
            UG: 'Uganda',
            UA: 'Ukraine',
            AE: 'United Arab Emirates',
            GB: 'United Kingdom',
            US: 'United States',
            UY: 'Uruguay',
            UZ: 'Uzbekistan',
            VU: 'Vanuatu',
            VA: 'Vatican City',
            VE: 'Venezuela',
            VN: 'Vietnam',
            YE: 'Yemen',
            ZM: 'Zambia',
            ZW: 'Zimbabwe',
        }
        return countryNames[code] || code // Fallback to code if not found
    }

    const shareText =
        // postText.length > 100
        //     ? postText.substring(0, 100) + '...'
        //     : postText || 'Share your best or worst customer service experience on Be Honest!'
        'Share your best or worst experience on BeHonest.'
    const handlePost = async () => {
        if (!postText.trim() || !category || !country) return // Require all selections
        setIsPosting(true)

        const newPost = {
            tag: `${category} • ${getFullCountryName(country)}`,
            businessName: businessName || null,
            country: country,
            time: new Date().toISOString(),
            content: postText,
            likes: 0,
            shares: 0,
        }

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            })

            if (res.ok) {
                setPostText('')
                setBusinessName('')
                setCategory('') // Reset category
                setCountry('') // Reset country
            } else {
                console.error('Failed to save post.')
            }
        } catch (error) {
            console.error('Post error:', error)
        } finally {
            setIsPosting(false)
        }
    }

    // const handleFiltersApply = (newFilters: { category: string; country: string }) => {
    //     const params = new URLSearchParams(searchParams.toString())
    //     if (newFilters.category) {
    //         params.set('category', newFilters.category)
    //     } else {
    //         params.delete('category')
    //     }
    //     if (newFilters.country) {
    //         params.set('country', newFilters.country)
    //     } else {
    //         params.delete('country')
    //     }
    //     router.push(`${pathname}?${params.toString()}`)
    //     console.log('Applied filters:', newFilters) // Optional
    // }

    // const handleFiltersClear = () => {
    //     router.push(pathname)
    //     console.log('Filters cleared') // Optional
    // }

    return (
        <div className="flex flex-col gap-5 sticky top-0 z-10 bg-white md:static md:z-auto md:bg-transparent p-4 md:p-0 pb-20 md:pb-0">
            {/* Quick Post card */}
            <div className="bg-white rounded-2xl shadow-md p-5">
                <strong className="text-gray-800 text-lg block mb-1">Quick Post</strong>
                <p className="text-gray-500 text-sm mb-3">
                    Share a customer service experience in under 2 minutes.
                </p>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Personal Stories">Personal Stories</option>
                    <option value="Work Life">Work Life</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Student Life">Student Life</option>
                </select>

                <input
                    type="text"
                    placeholder="Business Name (optional)"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="mt-3 w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-3 w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                >
                    <option value="">Select Country</option>
                    <option value="AF">Afghanistan</option>
                    <option value="AL">Albania</option>
                    <option value="DZ">Algeria</option>
                    <option value="AD">Andorra</option>
                    <option value="AO">Angola</option>
                    <option value="AG">Antigua and Barbuda</option>
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="BS">Bahamas</option>
                    <option value="BH">Bahrain</option>
                    <option value="BD">Bangladesh</option>
                    <option value="BB">Barbados</option>
                    <option value="BY">Belarus</option>
                    <option value="BE">Belgium</option>
                    <option value="BZ">Belize</option>
                    <option value="BJ">Benin</option>
                    <option value="BT">Bhutan</option>
                    <option value="BO">Bolivia</option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="BW">Botswana</option>
                    <option value="BR">Brazil</option>
                    <option value="BN">Brunei</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="CV">Cabo Verde</option>
                    <option value="KH">Cambodia</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CF">Central African Republic</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CO">Colombia</option>
                    <option value="KM">Comoros</option>
                    <option value="CG">Congo (Congo-Brazzaville)</option>
                    <option value="CD">Congo (Democratic Republic)</option>
                    <option value="CR">Costa Rica</option>
                    <option value="HR">Croatia</option>
                    <option value="CU">Cuba</option>
                    <option value="CY">Cyprus</option>
                    <option value="CZ">Czechia</option>
                    <option value="DK">Denmark</option>
                    <option value="DJ">Djibouti</option>
                    <option value="DM">Dominica</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egypt</option>
                    <option value="SV">El Salvador</option>
                    <option value="GQ">Equatorial Guinea</option>
                    <option value="ER">Eritrea</option>
                    <option value="EE">Estonia</option>
                    <option value="SZ">Eswatini</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FJ">Fiji</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="GA">Gabon</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="GR">Greece</option>
                    <option value="GD">Grenada</option>
                    <option value="GT">Guatemala</option>
                    <option value="GN">Guinea</option>
                    <option value="GW">Guinea-Bissau</option>
                    <option value="GY">Guyana</option>
                    <option value="HT">Haiti</option>
                    <option value="HN">Honduras</option>
                    <option value="HU">Hungary</option>
                    <option value="IS">Iceland</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IR">Iran</option>
                    <option value="IQ">Iraq</option>
                    <option value="IE">Ireland</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japan</option>
                    <option value="JO">Jordan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KE">Kenya</option>
                    <option value="KI">Kiribati</option>
                    <option value="KP">North Korea</option>
                    <option value="KR">South Korea</option>
                    <option value="KW">Kuwait</option>
                    <option value="KG">Kyrgyzstan</option>
                    <option value="LA">Laos</option>
                    <option value="LV">Latvia</option>
                    <option value="LB">Lebanon</option>
                    <option value="LS">Lesotho</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libya</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lithuania</option>
                    <option value="LU">Luxembourg</option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MY">Malaysia</option>
                    <option value="MV">Maldives</option>
                    <option value="ML">Mali</option>
                    <option value="MT">Malta</option>
                    <option value="MH">Marshall Islands</option>
                    <option value="MR">Mauritania</option>
                    <option value="MU">Mauritius</option>
                    <option value="MX">Mexico</option>
                    <option value="FM">Micronesia</option>
                    <option value="MD">Moldova</option>
                    <option value="MC">Monaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="MM">Myanmar</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NL">Netherlands</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Niger</option>
                    <option value="NG">Nigeria</option>
                    <option value="MK">North Macedonia</option>
                    <option value="NO">Norway</option>
                    <option value="OM">Oman</option>
                    <option value="PK">Pakistan</option>
                    <option value="PW">Palau</option>
                    <option value="PS">Palestine</option>
                    <option value="PA">Panama</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Peru</option>
                    <option value="PH">Philippines</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="QA">Qatar</option>
                    <option value="RO">Romania</option>
                    <option value="RU">Russia</option>
                    <option value="RW">Rwanda</option>
                    <option value="KN">Saint Kitts and Nevis</option>
                    <option value="LC">Saint Lucia</option>
                    <option value="VC">Saint Vincent and the Grenadines</option>
                    <option value="WS">Samoa</option>
                    <option value="SM">San Marino</option>
                    <option value="ST">Sao Tome and Principe</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="SN">Senegal</option>
                    <option value="RS">Serbia</option>
                    <option value="SC">Seychelles</option>
                    <option value="SL">Sierra Leone</option>
                    <option value="SG">Singapore</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="SO">Somalia</option>
                    <option value="ZA">South Africa</option>
                    <option value="SS">South Sudan</option>
                    <option value="ES">Spain</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SD">Sudan</option>
                    <option value="SR">Suriname</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="SY">Syria</option>
                    <option value="TW">Taiwan</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TZ">Tanzania</option>
                    <option value="TH">Thailand</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="TN">Tunisia</option>
                    <option value="TR">Turkey</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="TV">Tuvalu</option>
                    <option value="UG">Uganda</option>
                    <option value="UA">Ukraine</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="VU">Vanuatu</option>
                    <option value="VA">Vatican City</option>
                    <option value="VE">Venezuela</option>
                    <option value="VN">Vietnam</option>
                    <option value="YE">Yemen</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabwe</option>
                </select>

                <textarea
                    placeholder="Write your experience..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="mt-3 w-full h-24 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />

                <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-gray-500">
                        Visibility: <span className="font-semibold text-gray-700">Public</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handlePost}
                            disabled={isPosting || !postText.trim() || !category || !country}
                            className="bg-orange-500 hover:bg-orange-600 hover:cursor-pointer disabled:opacity-50 text-white text-sm px-4 py-2 rounded-md transition"
                        >
                            {isPosting ? 'Posting...' : 'Post Anonymously'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Share preview card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-300 rounded-2xl p-5 text-white text-center shadow-md">
                <p className="text-sm mb-3">{shareText}</p>
            </div>

            {/* Filters card - now imported from separate file */}
            {/* <Filters
                onApply={handleFiltersApply}
                onClear={handleFiltersClear}
                initialCategory={searchParams.get('category') || ''}
                initialCountry={searchParams.get('country') || ''}
            /> */}
        </div>
    )
}